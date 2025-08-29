
import express from 'express';
import { registerUser, registerTasker, loginUser, updateProfile, changePassword } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post('/', registerUser);

// @route   POST /api/users/tasker
// @desc    Register a new tasker user
// @access  Public
router.post('/tasker', registerTasker);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

// @route   PUT /api/users/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', verifyToken, updateProfile);

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', verifyToken, changePassword);

export default router;
