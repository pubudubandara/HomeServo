
import express from 'express';
import upload from '../middleware/cloudinaryUpload.js';
import { createTaskerProfile, checkTaskerProfile, getTaskerProfile, updateTaskerProfile, getTaskers } from '../controllers/taskerController.js';

const router = express.Router();
// Import auth middleware (convert to ES6 import)
import auth from '../middleware/auth.js';

// Check if tasker profile exists (protected route)
router.get('/profile/check', auth, checkTaskerProfile);

// Create tasker profile after login (protected route with profile image upload)
router.post('/profile', auth, upload.single('profileImage'), createTaskerProfile);

// Test endpoint to see all taskers
router.get('/test', getTaskers);

// Simple test endpoint
router.get('/ping', (req, res) => {
  res.json({ message: 'Tasker routes are working!', timestamp: new Date().toISOString() });
});

// Get current tasker's profile (protected route)
router.get('/profile', auth, getTaskerProfile);

// Update current tasker's profile (protected route)
router.put('/profile', auth, updateTaskerProfile);

export default router;
