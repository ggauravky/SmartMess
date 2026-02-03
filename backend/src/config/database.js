// This file handles the connection to MongoDB database

const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // mongoose.connect() connects to MongoDB using the connection string from .env file
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    // If connection fails, show error and stop the server
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1); // Exit with failure code
  }
};

// Export this function so we can use it in server.js
module.exports = connectDB;
