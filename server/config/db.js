const mongoose = require('mongoose');
const bootstrapAdmin = require('./bootstrapAdmin');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clientportal';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    // Ensure the single initial Admin account is bootstrapped if not existing
    await bootstrapAdmin();
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

