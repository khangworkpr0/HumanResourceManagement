/**
 * MongoDB Connection Module for Vercel Serverless
 * Ensures connection is fully ready before allowing queries
 */

const mongoose = require('mongoose');

// CRITICAL: Disable buffering BEFORE any connection attempt
// This prevents queries from buffering while connection is establishing
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
      throw new Error('MONGODB_URI is not defined in environment variables');
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
      serverSelectionTimeoutMS: 10000, // Fail fast if can't connect in 10s
      socketTimeoutMS: 45000,           // Socket timeout
      family: 4,                        // Use IPv4, skip IPv6
      maxPoolSize: 10,                  // Max connections in pool
      minPoolSize: 1,                   // Min connections to maintain
      retryWrites: true,                // Retry failed writes
      w: 'majority',                    // Write concern
      bufferMaxEntries: 0               // Disable buffering (fail fast)
    };

    // AWAIT connection before proceeding
    const conn = await mongoose.connect(uri, options);
    
    // Cache the connection
    cachedConnection = conn.connection;

    console.log('✅ MongoDB Connected Successfully');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   ReadyState: ${mongoose.connection.readyState} (1=connected)`);

    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('   Stack:', error.stack);
    
    // In serverless, don't exit process, just throw
    throw error;
  }
};

module.exports = connectDB;

