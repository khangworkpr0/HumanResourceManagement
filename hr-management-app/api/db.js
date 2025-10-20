/**
 * MongoDB Connection Module for Vercel Serverless
 * Ensures connection is fully ready before allowing queries
 * 
 * IMPORTANT: This file MUST be imported first to ensure:
 * 1. mongoose.set('bufferCommands', false) is set globally
 * 2. All models use the same mongoose instance with this connection
 */

const mongoose = require('mongoose');

// CRITICAL: Disable buffering BEFORE any connection attempt
// This prevents queries from buffering while connection is establishing
// This is set on the DEFAULT mongoose instance that all models will use
mongoose.set('bufferCommands', false);

let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if already connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    // Debug: Log connection string (masked password)
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      const error = new Error('MONGODB_URI is not defined in environment variables');
      error.code = 'ENV_VAR_MISSING';
      throw error;
    }
    
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log('🔌 Connecting to MongoDB:', maskedUri);

    // Disconnect any stale connections
    if (mongoose.connection.readyState !== 0) {
      console.log('⚠️ Disconnecting stale connection...');
      await mongoose.disconnect();
    }

    // CRITICAL: Connection options optimized for Vercel serverless
    const options = {
      serverSelectionTimeoutMS: 15000, // Increased to 15s for slow connections
      socketTimeoutMS: 45000,           // Socket timeout
      family: 4,                        // Use IPv4, skip IPv6
      maxPoolSize: 10,                  // Max connections in pool
      minPoolSize: 1,                   // Min connections to maintain
      retryWrites: true,                // Retry failed writes
      w: 'majority'                     // Write concern
    };

    console.log('⏳ Attempting connection...');
    
    // AWAIT connection before proceeding
    const conn = await mongoose.connect(uri, options);
    
    // Verify connection is actually ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`Connection succeeded but not ready. ReadyState: ${mongoose.connection.readyState}`);
    }
    
    // Cache the connection
    cachedConnection = conn.connection;

    console.log('✅ MongoDB Connected Successfully');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   ReadyState: ${mongoose.connection.readyState} (1=connected)`);

    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    
    // Enhanced error logging
    console.error('❌ MongoDB Connection Error:');
    console.error('   Message:', error.message);
    console.error('   Name:', error.name);
    console.error('   Code:', error.code || 'UNKNOWN');
    
    // Provide helpful hints based on error type
    if (error.message.includes('bad auth')) {
      console.error('💡 Hint: Check username/password in MONGODB_URI');
      error.hint = 'Invalid credentials - check MONGODB_URI username/password';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('💡 Hint: Cannot resolve MongoDB host - check cluster address');
      error.hint = 'Cannot reach MongoDB cluster - check network/firewall';
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Hint: MongoDB credentials are incorrect');
      error.hint = 'Authentication failed - create new database user';
    }
    
    // In serverless, don't exit process, just throw
    throw error;
  }
};

module.exports = connectDB;

