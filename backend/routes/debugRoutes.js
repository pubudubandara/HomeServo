import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// Debug endpoint to check JWT token contents
router.get('/debug/token', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Token decoded successfully',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

export default router;
