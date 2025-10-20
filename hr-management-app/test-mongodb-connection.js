/**
 * MongoDB Connection Debug Script
 * Tests connection and queries like Vercel environment
 * 
 * Usage: node test-mongodb-connection.js
 */

const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, 'backend', 'config.env') });

// CRITICAL: Disable buffering before any connection
mongoose.set('bufferCommands', false);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

console.log('\n' + '='.repeat(60));
console.log('  MongoDB Atlas Connection Test');
console.log('  Simulating Vercel Serverless Environment');
console.log('='.repeat(60) + '\n');

// Step 1: Check environment variables
log.info('Step 1: Checking environment variables...');
const uri = process.env.MONGODB_URI;

if (!uri) {
  log.error('MONGODB_URI not found in environment variables!');
  log.info('Check backend/config.env file');
  process.exit(1);
}

const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
log.success(`MONGODB_URI found: ${maskedUri}`);

// Validate URI format
if (!uri.startsWith('mongodb+srv://') && !uri.startsWith('mongodb://')) {
  log.error('Invalid MONGODB_URI format!');
  log.info('Should start with mongodb+srv:// or mongodb://');
  process.exit(1);
}

// Extract database name from URI
const dbMatch = uri.match(/\.net\/([^?]+)/);
const dbName = dbMatch ? dbMatch[1] : 'unknown';
log.info(`Target database: ${dbName}`);

console.log('');

// Step 2: Test connection
log.info('Step 2: Connecting to MongoDB Atlas...');
log.info('Using same options as Vercel deployment');

const options = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  w: 'majority'
};

log.info('Connection options:');
Object.keys(options).forEach(key => {
  console.log(`  - ${key}: ${options[key]}`);
});

console.log('');

const startTime = Date.now();

mongoose.connect(uri, options)
  .then(async (conn) => {
    const connectTime = Date.now() - startTime;
    log.success(`Connected in ${connectTime}ms`);
    log.success(`Host: ${conn.connection.host}`);
    log.success(`Database: ${conn.connection.name}`);
    log.success(`ReadyState: ${mongoose.connection.readyState} (1=connected)`);
    
    console.log('');
    
    // Step 3: Test query
    log.info('Step 3: Testing database query...');
    
    try {
      // Import User model
      const User = require('./backend/models/User');
      
      log.info('Executing: User.findOne()');
      const queryStart = Date.now();
      
      const user = await User.findOne().limit(1);
      const queryTime = Date.now() - queryStart;
      
      if (user) {
        log.success(`Query executed successfully in ${queryTime}ms`);
        log.success(`Found user: ${user.email || user.name}`);
        console.log('User details:', {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        });
      } else {
        log.warn('Query executed but no users found in database');
        log.info('Try creating a user first or check database name');
      }
      
      console.log('');
      
      // Step 4: Test count query
      log.info('Step 4: Counting documents...');
      const countStart = Date.now();
      const userCount = await User.countDocuments();
      const countTime = Date.now() - countStart;
      
      log.success(`Count query executed in ${countTime}ms`);
      log.success(`Total users in database: ${userCount}`);
      
      console.log('');
      
      // Step 5: Test connection state
      log.info('Step 5: Verifying connection state...');
      const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      log.success(`Current state: ${states[mongoose.connection.readyState]} (${mongoose.connection.readyState})`);
      
      console.log('');
      log.success('🎉 ALL TESTS PASSED!');
      console.log('');
      log.info('Connection is working correctly.');
      log.info('If Vercel still has issues, check:');
      console.log('  1. Environment variables on Vercel dashboard');
      console.log('  2. MongoDB Atlas IP whitelist (0.0.0.0/0)');
      console.log('  3. Vercel deployment logs');
      console.log('');
      
    } catch (queryError) {
      console.log('');
      log.error('Query failed!');
      log.error(`Error: ${queryError.message}`);
      
      if (queryError.message.includes('buffering timed out')) {
        log.error('BUFFERING TIMEOUT ERROR!');
        log.info('This means:');
        console.log('  1. Query tried to run before connection was ready');
        console.log('  2. Connection might have been dropped');
        console.log('  3. Database name might be wrong');
        log.info(`Current DB: ${mongoose.connection.name}`);
        log.info(`Expected DB: ${dbName}`);
        
        if (mongoose.connection.name !== dbName) {
          log.warn('DATABASE NAME MISMATCH!');
          log.warn(`Connected to: ${mongoose.connection.name}`);
          log.warn(`URI specifies: ${dbName}`);
        }
      }
      
      console.log('');
      log.error('Stack trace:');
      console.error(queryError.stack);
    }
    
    // Cleanup
    await mongoose.connection.close();
    log.info('Connection closed');
    process.exit(0);
    
  })
  .catch((error) => {
    const connectTime = Date.now() - startTime;
    console.log('');
    log.error(`Connection failed after ${connectTime}ms`);
    log.error(`Error: ${error.message}`);
    
    console.log('');
    log.error('Common issues:');
    console.log('  1. Invalid MONGODB_URI');
    console.log('  2. Wrong username/password');
    console.log('  3. IP not whitelisted on MongoDB Atlas');
    console.log('  4. Network connectivity issues');
    console.log('  5. MongoDB cluster is paused/stopped');
    
    console.log('');
    log.error('Full error:');
    console.error(error);
    
    process.exit(1);
  });

// Timeout after 15 seconds
setTimeout(() => {
  log.error('Test timed out after 15 seconds!');
  log.error('Connection is taking too long');
  process.exit(1);
}, 15000);


