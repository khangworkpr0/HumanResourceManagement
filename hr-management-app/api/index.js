/**
 * Vercel Serverless Function - API Entry Point
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('=> Using cached database connection');
    return cachedDb;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('MONGODB_URI not defined');
      return null;
    }

    console.log('=> Creating new database connection');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedDb = mongoose.connection;
    console.log(`MongoDB Connected: ${cachedDb.host}`);
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return null;
  }
}

// Middleware to connect DB before routes
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HR Management System API is running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    mongodbUriExists: !!process.env.MONGODB_URI,
    jwtSecretExists: !!process.env.JWT_SECRET
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'HR Management API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      employees: '/api/employees',
      departments: '/api/departments',
      contracts: '/api/contracts'
    }
  });
});

// Import and use routes directly
try {
  const authRoutes = require('../backend/routes/auth');
  app.use('/api/auth', authRoutes);
  
  const employeeRoutes = require('../backend/routes/employees');
  app.use('/api/employees', employeeRoutes);
  
  const employeeFileRoutes = require('../backend/routes/employeeFiles');
  app.use('/api/employees', employeeFileRoutes);
  
  const departmentRoutes = require('../backend/routes/departments');
  app.use('/api/departments', departmentRoutes);
  
  const contractRoutes = require('../backend/routes/contracts');
  app.use('/api/contracts', contractRoutes);
  
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  // Routes will not be available but health check will work
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Export for Vercel
module.exports = app;
