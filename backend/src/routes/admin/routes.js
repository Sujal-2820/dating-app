/**
 * Admin Routes
 * @owner: Sujal
 */

import express from 'express';
import * as adminController from '../../controllers/admin/adminController.js';
import { protect, restrictTo } from '../../middleware/auth.js';

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard Stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// Female Approval Routes
router.get('/females/pending', adminController.getPendingFemales);
router.patch('/females/:id/approve', adminController.approveFemale);
router.patch('/females/:id/reject', adminController.rejectFemale);
router.patch('/females/:id/request-resubmit', adminController.requestResubmitFemale);

export default router;
