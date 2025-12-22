// @ts-nocheck
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialSymbol } from '../../../shared/components/MaterialSymbol';
import { useTranslation } from '../../../core/hooks/useTranslation';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface OnboardingFormData {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  profilePhoto: string | null;
  aadhaarDocument: string | null;
}

export const SignupPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<OnboardingFormData>({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    profilePhoto: null,
    aadhaarDocument: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OnboardingFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('Full name is required');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('Phone number is required');
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = t('Please enter a valid 10-digit phone number');
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t('Date of birth is required');
    } else {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 18) {
        newErrors.dateOfBirth = t('You must be at least 18 years old');
      }
    }

    if (!formData.gender) {
      newErrors.gender = t('Please select your gender');
    }

    if (!formData.profilePhoto) {
      newErrors.profilePhoto = t('Profile photo is required');
    }

    // Female-specific validation
    if (formData.gender === 'female' && !formData.aadhaarDocument) {
      newErrors.aadhaarDocument = t('Aadhaar verification is required for female users');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, profilePhoto: t('Please select a valid image file') }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePhoto: reader.result as string }));
        setErrors((prev) => ({ ...prev, profilePhoto: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, aadhaarDocument: reader.result as string }));
        setErrors((prev) => ({ ...prev, aadhaarDocument: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Signup API call - Field names MUST match backend expectations
      const age = calculateAge(formData.dateOfBirth); // Calculate age from DOB

      const payload = {
        phoneNumber: formData.phone, // Backend expects 'phoneNumber' not 'phone'
        name: formData.fullName,
        age: age, // Backend needs age
        dateOfBirth: formData.dateOfBirth,
        role: formData.gender, // Backend expects 'role' not 'gender'
        photos: formData.profilePhoto ? [formData.profilePhoto] : [],
        ...(formData.gender === 'female' && {
          aadhaarCardUrl: formData.aadhaarDocument, // Backend expects 'aadhaarCardUrl'
        }),
      };

      const response = await axios.post(`${API_URL}/auth/signup-request`, payload);

      // DON'T clear localStorage or store token yet - that happens AFTER OTP verification

      // Navigate to OTP verification page
      // Pass phone number and signup data for OTP verification and potential resend
      navigate('/otp-verification', {
        state: {
          mode: 'signup',
          phoneNumber: formData.phone,
          signupData: payload // For OTP resend if needed
        }
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || t('Signup failed. Please try again.');
      setErrors({ fullName: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof OnboardingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            MatchMint
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('Create Your Account')}</h2>
          <p className="text-gray-600">{t('Start your journey to find meaningful connections')}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Full Name')}
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your full name"
                disabled={isSubmitting}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Contact Number')}
              </label>
              <div className="flex">
                <div className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg flex items-center">
                  <span className="text-gray-700 font-medium">+91</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="9876543210"
                  maxLength={10}
                  disabled={isSubmitting}
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                {t('Date of Birth')}
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                disabled={isSubmitting}
              />
              {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t('Gender')}</label>
              <div className="space-y-2">
                {(['male', 'female'] as const).map((gender) => (
                  <label
                    key={gender}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.gender === gender
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 hover:border-pink-300'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="mr-3 w-4 h-4 text-pink-500 focus:ring-pink-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-gray-700 capitalize">{gender}</span>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              {formData.profilePhoto ? (
                <div className="relative">
                  <img
                    src={formData.profilePhoto}
                    alt="Profile"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, profilePhoto: null }));
                      if (profilePhotoInputRef.current) {
                        profilePhotoInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    <MaterialSymbol name="close" size={20} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => profilePhotoInputRef.current?.click()}
                  className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-pink-500 transition-colors ${errors.profilePhoto ? 'border-red-500' : 'border-gray-300'
                    }`}
                  disabled={isSubmitting}
                >
                  <MaterialSymbol name="add_photo_alternate" size={48} className="text-gray-400 mb-2" />
                  <span className="text-gray-600">Click to upload photo</span>
                </button>
              )}
              <input
                ref={profilePhotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
              {errors.profilePhoto && <p className="mt-1 text-sm text-red-500">{errors.profilePhoto}</p>}
            </div>

            {/* Aadhaar Upload (Female Only) */}
            {formData.gender === 'female' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Verification <span className="text-red-500">*</span>
                </label>
                {formData.aadhaarDocument ? (
                  <div className="relative">
                    <img
                      src={formData.aadhaarDocument}
                      alt="Aadhaar"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, aadhaarDocument: null }));
                        if (aadhaarInputRef.current) {
                          aadhaarInputRef.current.value = '';
                        }
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      <MaterialSymbol name="close" size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => aadhaarInputRef.current?.click()}
                    className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-pink-500 transition-colors ${errors.aadhaarDocument ? 'border-red-500' : 'border-gray-300'
                      }`}
                    disabled={isSubmitting}
                  >
                    <MaterialSymbol name="badge" size={48} className="text-gray-400 mb-2" />
                    <span className="text-gray-600">Upload Aadhaar for verification</span>
                  </button>
                )}
                <input
                  ref={aadhaarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAadhaarChange}
                  className="hidden"
                />
                {errors.aadhaarDocument && <p className="mt-1 text-sm text-red-500">{errors.aadhaarDocument}</p>}
                <p className="mt-2 text-xs text-gray-500">Required for female account verification</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-lg hover:from-pink-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <MaterialSymbol name="sync" size={20} className="animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-pink-600 font-semibold hover:text-pink-700"
                disabled={isSubmitting}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
