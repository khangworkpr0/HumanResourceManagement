/**
 * Vercel Serverless Function - API Entry Point
 * FIXED: Properly await MongoDB connection before loading models/routes
 */

const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize app - will be started after DB connection
let isInitialized = false;

async function initializeApp() {
  if (isInitialized) {
    return;
  }

  try {
    // STEP 1: Connect to database FIRST
    console.log('🚀 Initializing application...');
    await connectDB();
    
    // STEP 2: NOW load routes (which require models)
    // Models are safe to use now because connection is ready
    const authRoutes = require('../backend/routes/auth');
    const employeeRoutes = require('../backend/routes/employees');
    const departmentRoutes = require('../backend/routes/departments');
    const contractRoutes = require('../backend/routes/contracts');
    const employeeFileRoutes = require('../backend/routes/employeeFiles');
    
    // STEP 3: Mount routes
    app.use('/api/auth', authRoutes);
    app.use('/api/employees', employeeRoutes);
    app.use('/api/employees', employeeFileRoutes);
    app.use('/api/departments', departmentRoutes);
    app.use('/api/contracts', contractRoutes);
    
    console.log('✅ All routes loaded successfully');
    isInitialized = true;
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    throw error;
  }
}

// Health check - Fast response without requiring DB
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.status(200).json({
    success: true,
    message: 'API is running',
    version: '2.0.0 - Fixed connection flow',
    timestamp: new Date().toISOString(),
    dbStatus: dbState[mongoose.connection.readyState] || 'unknown',
    dbReadyState: mongoose.connection.readyState,
    initialized: isInitialized,
    envCheck: {
      mongodbUri: !!process.env.MONGODB_URI,
      jwtSecret: !!process.env.JWT_SECRET,
      mongodbUriFormat: process.env.MONGODB_URI ? 
        (process.env.MONGODB_URI.startsWith('mongodb+srv://') ? 'valid' : 'invalid - should start with mongodb+srv://') 
        : 'missing'
    }
  });
});

// Test DB connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    await initializeApp();
    
    const mongoose = require('mongoose');
    const User = require('../backend/models/User');
    const count = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      message: 'Database connection and query successful',
      dbHost: mongoose.connection.host,
      dbName: mongoose.connection.name,
      dbReadyState: mongoose.connection.readyState,
      userCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    success: true, 
    message: 'HR Management API v2.0.0 - Connection Flow Fixed',
    deployedAt: new Date().toISOString(),
    fix: 'Proper async connection initialization before routes',
    initialized: isInitialized
  });
});

// Middleware to ensure app is initialized before processing requests
const ensureInitialized = async (req, res, next) => {
  try {
    await initializeApp();
    next();
  } catch (error) {
    console.error('❌ Initialization Error:', error);
    res.status(503).json({
      success: false,
      message: 'Service initialization failed',
      error: error.message,
      hints: [
        'Check MONGODB_URI in environment variables',
        'Ensure MongoDB Atlas is accessible',
        'Verify IP whitelist includes 0.0.0.0/0',
        'Check database credentials'
      ]
    });
  }
};

// Apply initialization middleware to all API routes (except health check)
app.use('/api/*', (req, res, next) => {
  // Skip health check
  if (req.path === '/api/health' || req.path === '/health') {
    return next();
  }
  return ensureInitialized(req, res, next);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not found',
    path: req.originalUrl
  });
});

// Pre-initialize on cold start to reduce first-request latency
initializeApp().catch(err => {
  console.error('⚠️ Pre-initialization failed:', err.message);
  // Non-fatal - will retry on first request
});

// Export for Vercel serverless
module.exports = app;
