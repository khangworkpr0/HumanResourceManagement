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
let routesLoaded = false;

// Load routes function - will be called AFTER DB connection
function loadRoutes() {
  if (routesLoaded) {
    return;
  }
  
  try {
    console.log('📦 Loading routes (after DB connection)...');
    const authRoutes = require('../backend/routes/auth');
    const employeeRoutes = require('../backend/routes/employees');
    const departmentRoutes = require('../backend/routes/departments');
    const contractRoutes = require('../backend/routes/contracts');
    const employeeFileRoutes = require('../backend/routes/employeeFiles');
    
    // Mount routes - DB already connected, models can be defined safely
    app.use('/api/auth', authRoutes);
    app.use('/api/employees', employeeRoutes);
    app.use('/api/employees', employeeFileRoutes);
    app.use('/api/departments', departmentRoutes);
    app.use('/api/contracts', contractRoutes);
    
    console.log('✅ All routes loaded successfully');
    routesLoaded = true;
  } catch (error) {
    console.error('❌ Failed to load routes:', error);
    throw error;
  }
}

async function initializeApp() {
  if (isInitialized) {
    return;
  }

  try {
    // STEP 1: Connect to database FIRST (before loading routes)
    console.log('🚀 Initializing application...');
    await connectDB();
    
    console.log('✅ Database connected');
    
    // STEP 2: Load routes AFTER DB is connected
    // This ensures models can be defined safely when routes/controllers import them
    loadRoutes();
    
    console.log('✅ App fully initialized');
    isInitialized = true;
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    throw error;
  }
}

// Middleware to ensure app is initialized before processing requests
const ensureInitialized = async (req, res, next) => {
  try {
    // Ensure DB is connected and routes are loaded before processing request
    await initializeApp();
    
    // Double-check connection is actually ready
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`Database not ready. ReadyState: ${mongoose.connection.readyState}`);
    }
    
    // Double-check routes are loaded
    if (!routesLoaded) {
      throw new Error('Routes not loaded yet');
    }
    
    console.log('✅ Request authorized, DB ready, routes loaded');
    next();
  } catch (error) {
    console.error('❌ Initialization Error:', error);
    console.error('   Error details:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    res.status(503).json({
      success: false,
      message: 'Service initialization failed',
      error: error.message,
      details: {
        errorName: error.name,
        errorCode: error.code || 'UNKNOWN'
      },
      hints: [
        'Check MONGODB_URI in environment variables',
        'Ensure MongoDB credentials are correct',
        'Verify MongoDB Atlas is accessible',
        'Check IP whitelist includes 0.0.0.0/0',
        'Ensure database name is correct in URI'
      ]
    });
  }
};

// Apply initialization middleware to all /api/* routes
// This ensures DB is connected and routes are loaded before any API request
app.use('/api/*', ensureInitialized);

// Health check - Fast response without requiring DB
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.status(200).json({
    success: true,
    message: 'API is running',
    version: '2.2.0 - Fixed route loading order',
    timestamp: new Date().toISOString(),
    dbStatus: dbState[mongoose.connection.readyState] || 'unknown',
    dbReadyState: mongoose.connection.readyState,
    initialized: isInitialized,
    routesLoaded: routesLoaded,
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

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Server error'
  });
});

// 404 handler - must be last
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not found',
    path: req.originalUrl,
    hint: 'Routes are loaded on first request. Try calling /api/health first.'
  });
});

// Export for Vercel serverless
// Note: Routes are loaded dynamically on first request via ensureInitialized middleware
// This ensures mongoose.connect() is called BEFORE models are defined
module.exports = app;
