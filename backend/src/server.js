// This is the main server file - the heart of our backend

// Step 1: Import required packages
require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Express framework for building APIs
const cors = require("cors"); // CORS allows frontend to talk to backend
const { connectDB } = require("./config/database"); // Our Supabase connection function

// Handle uncaught errors to prevent server crash
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Step 2: Create Express app
const app = express();

// Step 3: Middleware - These run before our routes
// CORS Configuration - Allow all Vercel deployments and localhost
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman, etc)
      if (!origin) return callback(null, true);
      
      // Allow all Vercel preview/production deployments
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      
      // Allow localhost for development
      if (origin.includes('localhost')) {
        return callback(null, true);
      }
      
      // Allow explicitly configured frontend URL
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // In development, allow all
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      // Log blocked origins for debugging
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow anyway to prevent blocking - you can change to false if needed
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.use(express.json()); // Parse incoming JSON data from requests

// Step 4: Connect to Supabase
connectDB();

// Step 5: Import Routes
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");

// Debug middleware to log all requests (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Step 6: Use Routes
app.use("/api/auth", authRoutes); // All auth routes will start with /api/auth
app.use("/api/menu", menuRoutes); // All menu routes will start with /api/menu
app.use("/api/ratings", ratingRoutes); // All rating routes will start with /api/ratings
app.use("/api/admin", adminRoutes); // All admin routes will start with /api/admin
app.use("/api/student", studentRoutes); // All student routes will start with /api/student
app.use("/api/complaints", studentRoutes); // Alias for complaint routes

// Step 7: Test Route - Check if server is working
app.get("/", (req, res) => {
  res.json({
    message: "🎉 SmartMess Backend is Running!",
    timestamp: new Date().toLocaleString(),
  });
});

// Step 8: Health Check Route - Good practice for production
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});

// Step 9: 404 Handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Step 10: Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Step 11: Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📋 Test: http://localhost:${PORT}/api/health\n`);
  }
});
