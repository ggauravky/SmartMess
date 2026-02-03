// This is the main server file - the heart of our backend

// Step 1: Import required packages
require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Express framework for building APIs
const cors = require('cors'); // CORS allows frontend to talk to backend
const connectDB = require('./config/database'); // Our MongoDB connection function

// Step 2: Create Express app
const app = express();

// Step 3: Middleware - These run before our routes
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON data from requests

// Step 4: Connect to MongoDB
connectDB();

// Step 5: Test Route - Check if server is working
app.get('/', (req, res) => {
  res.json({ 
    message: '🎉 SmartMess Backend is Running!',
    timestamp: new Date().toLocaleString()
  });
});

// Step 6: Health Check Route - Good practice for production
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Server is healthy',
    database: 'Connected'
  });
});

// Step 7: Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Test it by opening: http://localhost:${PORT}`);
});
