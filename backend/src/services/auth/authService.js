/**
 * Auth Service - Authentication Logic
 * @owner: Sujal
 * @purpose: Handle user registration and login
 */

import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { getEnvConfig } from '../../config/env.js';
import { BadRequestError, UnauthorizedError } from '../../utils/errors.js';

const { jwtSecret, jwtExpiresIn } = getEnvConfig();

const signToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: jwtExpiresIn,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

import Otp from '../../models/Otp.js';

// Helper to generate numeric OTP
const generateNumericOtp = (length = 4) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
};

export const requestLoginOtp = async (phoneNumber) => {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
        throw new BadRequestError('User not found. Please sign up first.');
    }

    const otp = generateNumericOtp(6);

    // Save/Update OTP
    await Otp.findOneAndUpdate(
        { phoneNumber, type: 'login' },
        { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
        { upsert: true, new: true }
    );

    // TODO: Send via SMS provider
    console.log(`[OTP-LOGIN] Mobile: ${phoneNumber}, Code: ${otp}`);

    return { message: 'OTP sent successfully' };
};

export const verifyLoginOtp = async (phoneNumber, otpCode) => {
    const otpRecord = await Otp.findOne({ phoneNumber, type: 'login', otp: otpCode });

    if (!otpRecord) {
        throw new BadRequestError('Invalid or expired OTP');
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
        throw new BadRequestError('User not found');
    }

    // Clear OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    return user;
};

export const requestSignupOtp = async (userData) => {
    const { phoneNumber } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
        throw new BadRequestError('Phone number already in use. Please login.');
    }

    const otp = generateNumericOtp(6);

    // Save/Update OTP with pending data
    await Otp.findOneAndUpdate(
        { phoneNumber, type: 'signup' },
        {
            otp,
            signupData: userData,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        },
        { upsert: true, new: true }
    );

    // TODO: Send via SMS provider
    console.log(`[OTP-SIGNUP] Mobile: ${phoneNumber}, Code: ${otp}`);

    return { message: 'OTP sent successfully' };
};

export const verifySignupOtp = async (phoneNumber, otpCode) => {
    const otpRecord = await Otp.findOne({ phoneNumber, type: 'signup', otp: otpCode });

    if (!otpRecord) {
        throw new BadRequestError('Invalid or expired OTP');
    }

    const userData = otpRecord.signupData;
    if (!userData) {
        throw new BadRequestError('Session expired. Please sign up again.');
    }

    const { role, name, age, aadhaarCardUrl, location, bio, interests, photos } = userData;

    // CRITICAL: Auto-translate name and bio for caching (cost optimization)
    // This translates once on signup and caches both languages in DB
    const { translateProfileData } = await import('../translate/translateService.js');
    const translatedProfile = await translateProfileData({ name, bio });

    // Build user object with cached translations
    const userPayload = {
        phoneNumber,
        role,
        genderPreference: role === 'male' ? 'female' : 'male', // Logic: Male -> Female, Female -> Male
        profile: {
            name: translatedProfile.name,
            name_en: translatedProfile.name_en,
            name_hi: translatedProfile.name_hi,
            age,
            location: {
                city: location || '', // Basic string for now until full geo implementation
                // Default coordinates will be [0,0] from schema
            },
            bio: translatedProfile.bio,
            bio_en: translatedProfile.bio_en,
            bio_hi: translatedProfile.bio_hi,
            interests,
            photos: photos?.map((p, i) => ({
                url: p.url || p, // Handle both object and string formats
                isPrimary: i === 0,
                uploadedAt: new Date()
            }))
        }
    };

    // Female-specific setup
    if (role === 'female') {
        // Need to ensure aadhaarUrl is present if role is female - actually validated in request step ideally?
        // But let's re-check or use what we have.

        userPayload.verificationDocuments = {
            aadhaarCard: {
                url: aadhaarCardUrl || '',
                uploadedAt: new Date(),
                verified: false
            }
        };
        userPayload.approvalStatus = 'pending';
        userPayload.isVerified = false;
    }

    // Create user
    const newUser = await User.create(userPayload);

    // Clear OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    return newUser;
};

export const generateToken = (userId) => {
    return signToken(userId);
};
