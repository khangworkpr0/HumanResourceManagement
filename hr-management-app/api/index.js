/**
 * Vercel Serverless Function - API Entry Point (Optimized for timeout)
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (cached)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('=> Using cached database connection');
    return cachedDb;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not defined');
    }

    console.log('=> Connecting to MongoDB...');
    
    // Optimized settings for serverless with longer timeouts
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 60000,
      bufferCommands: false  // Disable buffering for faster timeout errors
    });
    
    // Set query timeout globally
    mongoose.set('bufferTimeoutMS', 20000);

    cachedDb = mongoose.connection;
    console.log('✅ MongoDB Connected');
    return cachedDb;
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    throw error;
  }
}

// Health check - NO DB connection (fast response)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    envCheck: {
      mongodbUri: !!process.env.MONGODB_URI,
      jwtSecret: !!process.env.JWT_SECRET
    }
  });
});

// Root
app.get('/api', (req, res) => {
  res.json({ success: true, message: 'HR Management API v1.0' });
});

// Connect DB middleware (only for specific routes)
const dbMiddleware = async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      hint: 'Check MongoDB Atlas and MONGODB_URI'
    });
  }
};

// Load routes
let authRoutes, employeeRoutes, departmentRoutes, contractRoutes, employeeFileRoutes;

try {
  authRoutes = require('../backend/routes/auth');
  employeeRoutes = require('../backend/routes/employees');
  departmentRoutes = require('../backend/routes/departments');
  contractRoutes = require('../backend/routes/contracts');
  employeeFileRoutes = require('../backend/routes/employeeFiles');
  console.log('✅ All routes loaded');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Mount routes with DB middleware
if (authRoutes) app.use('/api/auth', dbMiddleware, authRoutes);
if (employeeRoutes) app.use('/api/employees', dbMiddleware, employeeRoutes);
if (employeeFileRoutes) app.use('/api/employees', dbMiddleware, employeeFileRoutes);
if (departmentRoutes) app.use('/api/departments', dbMiddleware, departmentRoutes);
if (contractRoutes) app.use('/api/contracts', dbMiddleware, contractRoutes);

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

// Export for Vercel
module.exports = app;
