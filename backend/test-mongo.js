const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI;

console.log('🔍 Testing MongoDB connection...');
console.log('URI:', MONGO_URI.replace(/:[^:@]*@/, ':***@'));

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  console.log('Port:', mongoose.connection.port);
  
  // Test database ping
  mongoose.connection.db.admin().ping()
    .then(() => {
      console.log('✅ Database ping successful');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Database ping failed:', err.message);
      process.exit(1);
    });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:');
  console.error('Error:', err.message);
  if (err.reason) console.error('Reason:', err.reason);
  process.exit(1);
});

// Timeout fallback
setTimeout(() => {
  console.error('❌ Connection timeout');
  process.exit(1);
}, 10000);
