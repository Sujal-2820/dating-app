/**
 * Admin Controller
 * @owner: Sujal
 */

import * as adminService from '../../services/admin/adminService.js';

import fs from 'fs';
import path from 'path';

/**
 * Get admin dashboard statistics
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await adminService.getDashboardStats();

        res.status(200).json({
            status: 'success',
            data: { stats }
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
