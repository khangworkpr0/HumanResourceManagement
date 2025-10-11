/**
 * Minimal Vercel Function - Test if serverless works
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Minimal API is working!',
    timestamp: new Date().toISOString(),
    mongodb_uri_exists: !!process.env.MONGODB_URI,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test MongoDB connection
app.get('/api/test-db', async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({
        success: false,
        message: 'MONGODB_URI not set in environment variables'
      });
    }

    if (mongoose.connection.readyState === 1) {
      return res.json({
        success: true,
        message: 'Already connected to MongoDB',
        dbStatus: 'connected'
      });
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    res.json({
      success: true,
      message: 'Connected to MongoDB successfully',
      dbStatus: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'MongoDB connection failed',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'HR Management API - Minimal Version',
    endpoints: {
      health: '/api/health',
      testDb: '/api/test-db'
    }
  });
});

// Export for Vercel
module.exports = app;

