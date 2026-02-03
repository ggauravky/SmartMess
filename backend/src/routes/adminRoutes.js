// Admin Routes - Define URL endpoints for admin operations

const express = require('express');
const router = express.Router();  // Create a router instance

// Import controller functions
const { 
  addStudent, 
  verifyStudent, 
  getAllStudents, 
  addMenu 
} = require('../controllers/adminController');

// ============================================
// STUDENT MANAGEMENT ROUTES
// ============================================

// POST /api/admin/students - Add new student
// Example request body:
// {
//   "name": "John Doe",
//   "email": "john@example.com",
//   "rollNumber": "2021001",
//   "password": "password123",
//   "hostelName": "Hostel A",
//   "roomNumber": "101",
//   "phoneNumber": "9876543210"
// }
router.post('/students', addStudent);

// GET /api/admin/students - Get all students
// Optional: /api/admin/students?verified=true (get only verified students)
// Optional: /api/admin/students?verified=false (get only unverified students)
router.get('/students', getAllStudents);

// PUT /api/admin/students/:studentId/verify - Verify a student
// Example: /api/admin/students/507f1f77bcf86cd799439011/verify
router.put('/students/:studentId/verify', verifyStudent);

// ============================================
// MENU MANAGEMENT ROUTES
// ============================================

// POST /api/admin/menu - Add menu for a date
// Example request body:
// {
//   "date": "2026-02-03",
//   "day": "Monday",
//   "breakfast": {
//     "items": ["Poha", "Tea", "Banana"],
//     "timing": "7:00 AM - 9:00 AM"
//   },
//   "lunch": {
//     "items": ["Dal", "Rice", "Roti", "Aloo Sabji"],
//     "timing": "12:00 PM - 2:00 PM"
//   },
//   "snacks": {
//     "items": ["Samosa", "Tea"],
//     "timing": "4:00 PM - 5:00 PM"
//   },
//   "dinner": {
//     "items": ["Dal", "Rice", "Roti", "Paneer"],
//     "timing": "7:00 PM - 9:00 PM"
//   },
//   "specialNote": "Today's special: Gulab Jamun"
// }
router.post('/menu', addMenu);

// Export the router
module.exports = router;
