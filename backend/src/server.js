// This is the main server file - the heart of our backend

// Step 1: Import required packages
require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Express framework for building APIs
const cors = require("cors"); // CORS allows frontend to talk to backend
const { connectDB } = require("./config/database"); // Our Supabase connection function

// Step 2: Create Express app
const app = express();

// Step 3: Middleware - These run before our routes
app.use(
  cors({
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON data from requests

// Step 4: Connect to Supabase
connectDB();

// Step 5: Import Routes
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

// Step 6: Use Routes
app.use("/api/auth", authRoutes); // All admin routes will start with /api/admin
app.use("/api/menu", menuRoutes); // All student routes will start with /api/student
app.use("/api/ratings", ratingRoutes);

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
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Test: http://localhost:${PORT}/api/health\n`);
});
