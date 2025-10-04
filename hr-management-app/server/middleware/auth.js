const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        }

        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.'
        });
    }
};

// Check if user is admin
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

// Check if user can access employee data (admin or own data)
const authorizeEmployeeAccess = (req, res, next) => {
    const employeeId = req.params.id;
    const userId = req.user._id.toString();
    
    // Admin can access all employee data
    if (req.user.role === 'admin') {
        return next();
    }
    
    // Employee can only access their own data
    if (employeeId === userId) {
        return next();
    }
    
    return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own data.'
    });
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
            const user = await User.findById(decoded.id).select('-password');
            
            if (user && user.isActive) {
                req.user = user;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Rate limiting middleware (simple in-memory store)
const rateLimitStore = new Map();

const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Clean old entries
        for (const [k, v] of rateLimitStore.entries()) {
            if (v.timestamp < windowStart) {
                rateLimitStore.delete(k);
            }
        }
        
        // Check current requests
        const current = rateLimitStore.get(key) || { count: 0, timestamp: now };
        
        if (current.timestamp < windowStart) {
            current.count = 1;
            current.timestamp = now;
        } else {
            current.count++;
        }
        
        rateLimitStore.set(key, current);
        
        if (current.count > maxRequests) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.'
            });
        }
        
        next();
    };
};

module.exports = {
    authenticate,
    authorizeAdmin,
    authorizeEmployeeAccess,
    optionalAuth,
    generateToken,
    rateLimit
};
