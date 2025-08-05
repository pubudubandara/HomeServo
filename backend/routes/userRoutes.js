
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
const router = express.Router();

// @route   POST /api/users
// @desc    Register a new user
// @access  Public

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post('/', registerUser);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

export default router;
