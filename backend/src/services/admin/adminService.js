/**
 * Admin Service - Dashboard Stats and Management
 * @owner: Admin Operations
 */

import User from '../../models/User.js';
import Transaction from '../../models/Transaction.js';
import Withdrawal from '../../models/Withdrawal.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

/**
 * Get dashboard statistics for admin
 */
export const getDashboardStats = async () => {
    // Get total users count by role
    const userCounts = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const stats = {
        totalUsers: {
            male: userCounts.find(u => u._id === 'male')?.count || 0,
            female: userCounts.find(u => u._id === 'female')?.count || 0,
            total: 0
        },
        activeUsers: {
            last24h: 0,
            last7d: 0,
            last30d: 0
        },
        revenue: {
            deposits: 0,
            payouts: 0,
            profit: 0
        },
        pendingWithdrawals: 0,
        totalTransactions: 0
    };

    stats.totalUsers.total = stats.totalUsers.male + stats.totalUsers.female;

    // Active users
    const now = new Date();
    const day24Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const days7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    stats.activeUsers.last24h = await User.countDocuments({ lastSeen: { $gte: day24Ago } });
    stats.activeUsers.last7d = await User.countDocuments({ lastSeen: { $gte: days7Ago } });
    stats.activeUsers.last30d = await User.countDocuments({ lastSeen: { $gte: days30Ago } });

    // Revenue stats from transactions
    const revenueData = await Transaction.aggregate([
        {
            $group: {
                _id: null,
                totalDeposits: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'coin_purchase'] }, '$amount', 0]
                    }
                }
            }
        }
    ]);

    if (revenueData.length > 0) {
        stats.revenue.deposits = revenueData[0].totalDeposits || 0;
    }

    // Payouts from withdrawals
    const payoutData = await Withdrawal.aggregate([
        {
            $match: { status: 'completed' }
        },
        {
            $group: {
                _id: null,
                totalPayouts: { $sum: '$amount' }
            }
        }
    ]);

    if (payoutData.length > 0) {
        stats.revenue.payouts = payoutData[0].totalPayouts || 0;
    }

    stats.revenue.profit = stats.revenue.deposits - stats.revenue.payouts;

    // Pending withdrawals
    stats.pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });

    // Total transactions
    stats.totalTransactions = await Transaction.countDocuments();

    return stats;
};

/**
 * Get pending females for approval
 */
export const getPendingFemales = async (pagination, status = 'pending') => {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const query = {
        role: 'female',
        approvalStatus: status
    };

    const users = await User.find(query)
        .select('phoneNumber profile verificationDocuments approvalStatus rejectionReason createdAt lastSeen isBlocked isVerified')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await User.countDocuments(query);

    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

/**
 * Approve female user
 */
export const approveFemale = async (userId, adminId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    if (user.role !== 'female') {
        throw new BadRequestError('User is not a female');
    }

    user.approvalStatus = 'approved';
    user.isVerified = true;
    user.rejectionReason = undefined;

    await user.save();

    return user;
};

/**
 * Reject female user
 */
export const rejectFemale = async (userId, adminId, reason) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    if (user.role !== 'female') {
        throw new BadRequestError('User is not a female');
    }

    user.approvalStatus = 'rejected';
    user.rejectionReason = reason;

    await user.save();

    return user;
};

/**
 * Request resubmission from female user
 */
export const requestResubmitFemale = async (userId, adminId, reason) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    if (user.role !== 'female') {
        throw new BadRequestError('User is not a female');
    }

    user.approvalStatus = 'resubmit_required';
    user.rejectionReason = reason;

    await user.save();

    return user;
};
