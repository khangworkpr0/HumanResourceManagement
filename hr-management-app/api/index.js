/**
 * Vercel Serverless Function - API Entry Point
 * FIXED: Properly await MongoDB connection before loading models/routes
 * 
 * CRITICAL: Import db.js FIRST to ensure mongoose.set('bufferCommands', false)
 * is called before any models are defined
 */

// Import db.js FIRST - this sets bufferCommands = false on global mongoose
const connectDB = require('./db');

const express = require('express');
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
let routesCache = {};

async function initializeApp() {
  if (isInitialized) {
    return;
  }

  try {
    // Connect to database
    console.log('🚀 Initializing application...');
    await connectDB();
    
    console.log('✅ Database connected');
    
    // Verify mongoose is properly configured
    const mongoose = require('mongoose');
    console.log(`📊 Mongoose bufferCommands: ${mongoose.get('bufferCommands')}`);
    console.log(`📊 Connection readyState: ${mongoose.connection.readyState}`);
    
    if (mongoose.get('bufferCommands') !== false) {
      console.warn('⚠️ WARNING: bufferCommands should be false!');
    }
    
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
    // Ensure DB is connected before processing request
    await initializeApp();
    
    // Double-check connection is actually ready
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`Database not ready. ReadyState: ${mongoose.connection.readyState}`);
    }
    
    console.log('✅ DB ready, processing request');
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

// Lazy route loader - loads routes AFTER DB connection
function getRoutes(name) {
  if (!routesCache[name]) {
    console.log(`📦 Loading ${name} routes...`);
    routesCache[name] = require(`../backend/routes/${name}`);
  }
  return routesCache[name];
}

// Mount route handlers with lazy loading
// Routes are registered immediately, but controllers (and models) are only loaded AFTER ensureInitialized
app.use('/api/auth', ensureInitialized, (req, res, next) => {
  getRoutes('auth')(req, res, next);
});

app.use('/api/employees', ensureInitialized, (req, res, next) => {
  getRoutes('employees')(req, res, next);
});

app.use('/api/employees', ensureInitialized, (req, res, next) => {
  getRoutes('employeeFiles')(req, res, next);
});

app.use('/api/departments', ensureInitialized, (req, res, next) => {
  getRoutes('departments')(req, res, next);
});

app.use('/api/contracts', ensureInitialized, (req, res, next) => {
  getRoutes('contracts')(req, res, next);
});

console.log('✅ Route handlers registered (will load on first request)');

// Health check - Fast response without requiring DB
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.status(200).json({
    success: true,
    message: 'API is running',
    version: '2.3.0 - Lazy route loading',
    timestamp: new Date().toISOString(),
    dbStatus: dbState[mongoose.connection.readyState] || 'unknown',
    dbReadyState: mongoose.connection.readyState,
    initialized: isInitialized,
    routesCached: Object.keys(routesCache).length,
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
    path: req.originalUrl
  });
});

// Export for Vercel serverless
// Note: Routes are loaded dynamically on first request via ensureInitialized middleware
// This ensures mongoose.connect() is called BEFORE models are defined
module.exports = app;
