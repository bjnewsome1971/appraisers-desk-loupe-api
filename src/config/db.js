const mongoose = require('mongoose');
const { DB_URI, NODE_ENV } = require('./index');

const connectDB = async () => {
  try {
    const uri = DB_URI;

    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (NODE_ENV !== 'production') {
      console.log('Continuing without database connection for local development.');
      return;
    }
    process.exit(1);
  }
};

module.exports = { connectDB };
