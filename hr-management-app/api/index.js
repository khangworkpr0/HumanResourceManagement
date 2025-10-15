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

// GLOBAL cached connection for serverless (persists across invocations)
let cachedDb = null;
let connectionPromise = null;

async function connectToDatabase() {
  // Return cached connection if already connected
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached database connection');
    return cachedDb;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    console.log('⏳ Waiting for ongoing connection...');
    return connectionPromise;
  }

  // Create new connection
  connectionPromise = (async () => {
    try {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MONGODB_URI not defined in environment variables');
      }

      console.log('🔌 Connecting to MongoDB Atlas...');
      
      // CRITICAL: Disable buffering to prevent timeout errors in serverless
      mongoose.set('bufferCommands', false);
      
      // Optimized settings for Vercel serverless
      const options = {
        serverSelectionTimeoutMS: 10000, // 10s timeout
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip IPv6
        maxPoolSize: 10,
        minPoolSize: 1
      };

      // Only connect if not already connected/connecting
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri, options);
      }

      cachedDb = mongoose.connection;
      
      console.log('✅ MongoDB Connected Successfully');
      console.log(`   DB Host: ${mongoose.connection.host}`);
      console.log(`   DB Name: ${mongoose.connection.name}`);
      
      return cachedDb;
    } catch (error) {
      cachedDb = null;
      connectionPromise = null;
      console.error('❌ MongoDB Connection Error:', error.message);
      throw error;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
}

// Health check - NO DB connection (fast response)
app.get('/api/health', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    dbStatus: dbState[mongoose.connection.readyState] || 'unknown',
    dbReadyState: mongoose.connection.readyState,
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
    await connectToDatabase();
    
    // Try a simple query to verify connection works
    const User = require('../backend/models/User');
    const count = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      dbHost: mongoose.connection.host,
      dbName: mongoose.connection.name,
      userCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Root
app.get('/api', (req, res) => {
  res.json({ success: true, message: 'HR Management API v1.0' });
});

// Connect DB middleware (only for specific routes)
const dbMiddleware = async (req, res, next) => {
  try {
    // Ensure database is connected before processing request
    await connectToDatabase();
    
    // Double check connection is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not ready');
    }
    
    next();
  } catch (error) {
    console.error('❌ DB Middleware Error:', error.message);
    
    const errorResponse = {
      success: false,
      message: 'Database connection failed',
      error: error.message,
      hints: [
        'Check MONGODB_URI in Vercel environment variables',
        'Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0',
        'Verify database user credentials are correct',
        'Check if MongoDB cluster is running'
      ]
    };
    
    // Add more details in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = error.stack;
    }
    
    res.status(503).json(errorResponse);
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
