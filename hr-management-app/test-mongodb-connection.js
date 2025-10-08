/**
 * Test MongoDB Atlas Connection
 * 
 * Script này test connection tới MongoDB Atlas trước khi deploy
 * 
 * Usage:
 *   node test-mongodb-connection.js
 */

const mongoose = require('mongoose');

// Connection string với database name 'hrms'
const MONGODB_URI = 'mongodb+srv://khua8986_db_user:MQ2FXE9phRNFkgGJ@cluster0.3ohoovb.mongodb.net/hrms?retryWrites=true&w=majority&appName=Cluster0';

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║   Testing MongoDB Atlas Connection...                     ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📡 Connecting to:', 'cluster0.3ohoovb.mongodb.net');
console.log('👤 User:', 'khua8986_db_user');
console.log('🗄️  Database:', 'hrms');
console.log('\n⏳ Please wait...\n');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10s timeout
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   ✅ SUCCESS! MongoDB Connected Successfully!              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log('📊 Connection Details:');
  console.log('   • Database:', mongoose.connection.name || 'hrms');
  console.log('   • Host:', mongoose.connection.host);
  console.log('   • Port:', mongoose.connection.port || '27017');
  console.log('   • ReadyState:', mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌');
  console.log('   • Collections:', mongoose.connection.collections ? Object.keys(mongoose.connection.collections).length : 0);
  
  console.log('\n🎉 Your MongoDB Atlas is ready for deployment!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Set MONGODB_URI in Vercel Dashboard');
  console.log('   2. Ensure Network Access allows 0.0.0.0/0');
  console.log('   3. Deploy to Vercel');
  console.log('   4. Test /api/health endpoint\n');
  
  // Close connection
  mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   ❌ FAILED! MongoDB Connection Error                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.error('❌ Error Type:', err.name);
  console.error('❌ Error Message:', err.message);
  
  console.log('\n🔍 Troubleshooting Steps:\n');
  
  if (err.message.includes('ETIMEDOUT') || err.message.includes('timed out')) {
    console.log('⚠️  Issue: Connection Timeout');
    console.log('   Possible causes:');
    console.log('   1. ❌ IP address not whitelisted on MongoDB Atlas');
    console.log('   2. ❌ Network/Firewall blocking connection');
    console.log('   3. ❌ MongoDB Atlas cluster not running');
    console.log('\n   ✅ Fix:');
    console.log('   • Go to MongoDB Atlas → Network Access');
    console.log('   • Add IP: 0.0.0.0/0 (Allow from anywhere)');
    console.log('   • Wait 2-3 minutes for changes to propagate');
  } 
  else if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
    console.log('⚠️  Issue: Authentication Failed');
    console.log('   Possible causes:');
    console.log('   1. ❌ Incorrect username or password');
    console.log('   2. ❌ User not created in MongoDB Atlas');
    console.log('   3. ❌ User lacks permissions');
    console.log('\n   ✅ Fix:');
    console.log('   • Verify username: khua8986_db_user');
    console.log('   • Verify password: MQ2FXE9phRNFkgGJ');
    console.log('   • Go to MongoDB Atlas → Database Access');
    console.log('   • Ensure user has "Read and write" permissions');
  }
  else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
    console.log('⚠️  Issue: DNS Resolution Failed');
    console.log('   Possible causes:');
    console.log('   1. ❌ No internet connection');
    console.log('   2. ❌ DNS server issues');
    console.log('   3. ❌ Incorrect cluster hostname');
    console.log('\n   ✅ Fix:');
    console.log('   • Check internet connection');
    console.log('   • Try: ping cluster0.3ohoovb.mongodb.net');
    console.log('   • Verify cluster URL in MongoDB Atlas');
  }
  else {
    console.log('⚠️  Issue: Unknown Error');
    console.log('\n   ✅ General Troubleshooting:');
    console.log('   • Check MongoDB Atlas cluster status');
    console.log('   • Verify connection string format');
    console.log('   • Check MongoDB Atlas logs');
    console.log('   • Contact MongoDB support if persistent');
  }
  
  console.log('\n📚 Documentation:');
  console.log('   • See: MONGODB_SETUP_COMPLETE.md');
  console.log('   • MongoDB Atlas: https://cloud.mongodb.com');
  console.log('   • Troubleshooting: https://docs.mongodb.com/manual/reference/connection-string/\n');
  
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Connection test interrupted by user');
  mongoose.connection.close();
  process.exit(0);
});

