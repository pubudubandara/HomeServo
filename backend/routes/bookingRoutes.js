import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats,
  addBookingFeedback,
  getTaskerBookings,
  getServiceBookings,
  getCustomerBookings,
  createTestBookings
} from '../controllers/bookingController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createBooking); // Create new booking (public)

// Tasker routes (for getting their bookings)
router.get('/tasker/:taskerId', getTaskerBookings); // Get bookings for a specific tasker
router.get('/service/:serviceId', getServiceBookings); // Get bookings for a specific service
router.get('/customer/:email', getCustomerBookings); // Get bookings for a specific customer

// Protected routes (require authentication) - commented out for now since we don't have user auth in frontend
// router.get('/:id', verifyToken, getBookingById); // Get booking by ID
// router.post('/:id/feedback', verifyToken, addBookingFeedback); // Add customer feedback

// Temporary public routes for testing
router.get('/:id', getBookingById); // Get booking by ID (public for now)
router.post('/:id/feedback', addBookingFeedback); // Add customer feedback (public for now)

// Admin only routes - commented out for now
// router.get('/', verifyToken, verifyAdmin, getAllBookings); // Get all bookings
// router.put('/:id/status', verifyToken, verifyAdmin, updateBookingStatus); // Update booking status
// router.get('/admin/statistics', verifyToken, verifyAdmin, getBookingStats); // Get booking statistics

// Temporary public admin routes for testing
router.get('/', getAllBookings); // Get all bookings (public for now)
router.put('/:id/status', updateBookingStatus); // Update booking status (public for now)
router.get('/admin/statistics', getBookingStats); // Get booking statistics (public for now)

// Test route to create sample bookings
router.post('/test/create', createTestBookings); // Create test bookings

export default router;
