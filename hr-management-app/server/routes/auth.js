const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    deactivateUser
} = require('../controllers/authController');
const { authenticate, authorizeAdmin, rateLimit } = require('../middleware/auth');

// Apply rate limiting to auth routes
router.use(rateLimit(10, 15 * 60 * 1000)); // 10 requests per 15 minutes

// Public routes
router.post('/login', login);
router.post('/register', authenticate, authorizeAdmin, register); // Admin only

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Admin only routes
router.get('/users', authorizeAdmin, getAllUsers);
router.put('/users/:id/deactivate', authorizeAdmin, deactivateUser);

module.exports = router;
