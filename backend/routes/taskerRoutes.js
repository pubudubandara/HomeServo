
import express from 'express';
import upload from '../middleware/cloudinaryUpload.js';
import { registerTasker } from '../controllers/taskerController.js';

const router = express.Router();

// Register a new tasker (with profile image upload)
router.post('/', upload.single('profileImage'), registerTasker);

export default router;
