
import express from 'express';
import upload from '../middleware/cloudinaryUpload.js';
import { registerTasker, getTaskerProfile } from '../controllers/taskerController.js';

const router = express.Router();
// Import auth middleware (convert to ES6 import)
import auth from '../middleware/auth.js';


// Register a new tasker (with profile image upload)
router.post('/', upload.single('profileImage'), registerTasker);

// Get current tasker's profile (protected route)
router.get('/profile', auth, getTaskerProfile);

export default router;
