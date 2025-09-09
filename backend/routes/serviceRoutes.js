import express from 'express';
import {
  getTaskerServices,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService,
  getServiceStats,
  getAllServicesForAdmin,
  adminReviewService,
  getPublicServices,
  getServiceProfile
} from '../controllers/serviceController.js';
import auth from '../middleware/auth.js';
import { checkServiceOwnership, checkTaskerAccess, checkAdminRole } from '../middleware/serviceAuth.js';
import { uploadServiceImage } from '../middleware/cloudinaryUpload.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/public', getPublicServices);
router.get('/profile/:serviceId', getServiceProfile);

// Image upload route
router.post('/upload-image', auth, uploadServiceImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: req.file.path,
        publicId: req.file.filename
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// Tasker service routes (protected with ownership checks)
router.get('/tasker/:taskerId', auth, checkTaskerAccess, getTaskerServices);
router.post('/tasker/:taskerId', auth, checkTaskerAccess, createService);
router.put('/:serviceId', auth, checkServiceOwnership, updateService);
router.patch('/:serviceId/toggle-status', auth, checkServiceOwnership, toggleServiceStatus);
router.delete('/:serviceId', auth, checkServiceOwnership, deleteService);
router.get('/tasker/:taskerId/stats', auth, checkTaskerAccess, getServiceStats);

// Admin routes (for future implementation)
router.get('/admin/all', auth, checkAdminRole, getAllServicesForAdmin);
router.patch('/admin/:serviceId/review', auth, checkAdminRole, adminReviewService);

export default router;
