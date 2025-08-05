
import express from 'express';
import { registerUser } from '../controllers/userController.js';
const router = express.Router();

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post('/', registerUser);

export default router;
