/**
 * Admin Controller
 * @owner: Sujal
 */

import * as adminService from '../../services/admin/adminService.js';
import Gift from '../../models/Gift.js';

import fs from 'fs';
import path from 'path';

/**
 * Get admin dashboard statistics
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const { stats, charts, recentActivity } = await adminService.getDashboardStats();

        res.status(200).json({
            status: 'success',
            data: { stats, charts, recentActivity }
        });
    } catch (error) {
        next(error);
    }
};

export const getPendingFemales = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status || 'pending';

        const result = await adminService.getPendingFemales({ page, limit }, status);

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const approveFemale = async (req, res, next) => {
    try {
        const { id } = req.params;
        // req.user.id is the admin ID from auth middleware
        const user = await adminService.approveFemale(id, req.user._id);

        res.status(200).json({
            status: 'success',
            data: {
                user,
                message: 'Female user approved successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};

export const rejectFemale = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                status: 'fail',
                message: 'Rejection reason is required'
            });
        }

        const user = await adminService.rejectFemale(id, req.user._id, reason);

        res.status(200).json({
            status: 'success',
            data: {
                user,
                message: 'Female user rejected'
            }
        });
    } catch (error) {
        next(error);
    }
};

export const requestResubmitFemale = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                status: 'fail',
                message: 'Reason for resubmission is required'
            });
        }

        const user = await adminService.requestResubmitFemale(id, req.user._id, reason);

        res.status(200).json({
            status: 'success',
            data: {
                user,
                message: 'Resubmission request sent to user'
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * List all users for admin
 */
export const listUsers = async (req, res, next) => {
    try {
        const filters = {
            search: req.query.search,
            role: req.query.role,
            status: req.query.status
        };
        const pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20
        };

        const result = await adminService.listUsers(filters, pagination);

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * List all transactions for admin
 */
export const listTransactions = async (req, res, next) => {
    try {
        const filters = {
            search: req.query.search,
            type: req.query.type,
            status: req.query.status
        };
        const pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20
        };

        const result = await adminService.listTransactions(filters, pagination);

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get audit logs
 */
export const getAuditLogs = async (req, res, next) => {
    try {
        const filters = {
            search: req.query.search,
            action: req.query.action,
            adminId: req.query.adminId
        };
        const pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 50
        };

        const result = await adminService.getAuditLogs(filters, pagination);

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get platform settings
 */
export const getAppSettings = async (req, res, next) => {
    try {
        const settings = await adminService.getAppSettings();

        res.status(200).json({
            status: 'success',
            data: { settings }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update platform settings
 */
export const updateAppSettings = async (req, res, next) => {
    try {
        const settings = await adminService.updateAppSettings(req.body, req.user._id);

        res.status(200).json({
            status: 'success',
            data: { settings }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * List all gifts with costs
 */
export const listGifts = async (req, res, next) => {
    try {
        const gifts = await Gift.find()
            .select('name category imageUrl cost isActive displayOrder')
            .sort({ displayOrder: 1, name: 1 });

        res.status(200).json({
            status: 'success',
            data: { gifts }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update gift cost
 */
export const updateGiftCost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { cost } = req.body;

        if (typeof cost !== 'number' || cost < 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Valid cost is required (must be a positive number)'
            });
        }

        const gift = await Gift.findByIdAndUpdate(
            id,
            { cost },
            { new: true, runValidators: true }
        );

        if (!gift) {
            return res.status(404).json({
                status: 'fail',
                message: 'Gift not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { gift }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle user block status
 */
export const toggleBlockUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await adminService.toggleBlockUser(id, req.user._id);

        res.status(200).json({
            status: 'success',
            data: {
                user,
                message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle user verification status
 */
export const toggleVerifyUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await adminService.toggleVerifyUser(id, req.user._id);

        res.status(200).json({
            status: 'success',
            data: {
                user,
                message: `User verification ${user.isVerified ? 'enabled' : 'disabled'} successfully`
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 */
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await adminService.deleteUser(id, req.user._id);

        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
