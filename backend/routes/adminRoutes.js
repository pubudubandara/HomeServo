import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

// Import from separate controller files
import { getDashboardData } from '../controllers/admin/dashboardController.js';
import { getApprovalRequests, approveRequest, rejectRequest } from '../controllers/admin/approvalController.js';
import { getAllUsers, getUserById, updateUserStatus, deleteUser } from '../controllers/admin/usersController.js';
import { getAllTaskers, getTaskerById, approveTasker, rejectTasker, updateTaskerStatus } from '../controllers/admin/taskersController.js';

const router = express.Router();

// All routes require authentication and admin privileges
// Dashboard route
router.get('/dashboard', verifyToken, verifyAdmin, getDashboardData);

// Approval routes
router.get('/approval', verifyToken, verifyAdmin, getApprovalRequests);
router.put('/approval/:id/approve', verifyToken, verifyAdmin, approveRequest);
router.put('/approval/:id/reject', verifyToken, verifyAdmin, rejectRequest);

// User management routes
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.get('/users/:id', verifyToken, verifyAdmin, getUserById);
router.put('/users/:id/status', verifyToken, verifyAdmin, updateUserStatus);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);

// Tasker management routes
router.get('/taskers', verifyToken, verifyAdmin, getAllTaskers);
router.get('/taskers/:id', verifyToken, verifyAdmin, getTaskerById);
router.put('/taskers/:id/approve', verifyToken, verifyAdmin, approveTasker);
router.put('/taskers/:id/reject', verifyToken, verifyAdmin, rejectTasker);
router.put('/taskers/:id/status', verifyToken, verifyAdmin, updateTaskerStatus);

export default router;
