/**
 * Vercel Serverless Function - API Entry Point (Simplified for debugging)
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

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Try to connect to database
    await connectToDatabase();
    
    res.status(200).json({
      success: true,
      message: 'HR Management System API is running on Vercel',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      mongodbUriExists: !!process.env.MONGODB_URI,
      jwtSecretExists: !!process.env.JWT_SECRET
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'HR Management API',
    version: '1.0.0 (Simplified)',
    endpoints: {
      health: '/api/health'
    }
  });
});

// Lazy load routes only when needed
app.use('/api/auth', async (req, res, next) => {
  try {
    await connectToDatabase();
    const authRoutes = require('../backend/routes/auth');
    authRoutes(req, res, next);
  } catch (error) {
    console.error('Error loading auth routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load auth module',
      error: error.message
    });
  }
});

app.use('/api/employees', async (req, res, next) => {
  try {
    await connectToDatabase();
    const employeeRoutes = require('../backend/routes/employees');
    employeeRoutes(req, res, next);
  } catch (error) {
    console.error('Error loading employee routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load employees module',
      error: error.message
    });
  }
});

app.use('/api/departments', async (req, res, next) => {
  try {
    await connectToDatabase();
    const departmentRoutes = require('../backend/routes/departments');
    departmentRoutes(req, res, next);
  } catch (error) {
    console.error('Error loading department routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load departments module',
      error: error.message
    });
  }
});

app.use('/api/contracts', async (req, res, next) => {
  try {
    await connectToDatabase();
    const contractRoutes = require('../backend/routes/contracts');
    contractRoutes(req, res, next);
  } catch (error) {
    console.error('Error loading contract routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load contracts module',
      error: error.message
    });
  }
});

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
