// Student Routes - Define URL endpoints for student operations

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getTodaysMenu,
  getMenuByDate,
  getWeeklyMenu,
  submitRating,
  submitComplaint,
  getMyComplaints
} = require('../controllers/studentController');

// ============================================
// MENU ROUTES
// ============================================

// GET /api/student/menu/today - Get today's menu
// No parameters needed
router.get('/menu/today', getTodaysMenu);

// GET /api/student/menu?date=2026-02-03 - Get menu by specific date
// Query parameter: date (YYYY-MM-DD format)
router.get('/menu', getMenuByDate);

// GET /api/student/menu/weekly - Get menu for next 7 days
// No parameters needed
router.get('/menu/weekly', getWeeklyMenu);

// ============================================
// RATING ROUTES
// ============================================

// POST /api/student/rating - Submit a rating for a meal
// Request body:
// {
//   "studentId": "uuid-here",
//   "menuId": "uuid-here",
//   "mealType": "breakfast",  // or lunch, snacks, dinner
//   "rating": 4,              // 1 to 5
//   "comment": "Good food"    // optional
// }
router.post('/rating', submitRating);

// ============================================
// COMPLAINT ROUTES
// ============================================

// POST /api/student/complaint - Submit a complaint
// Request body:
// {
//   "studentId": "uuid-here",
//   "category": "food_quality",  // or hygiene, service, quantity, other
//   "subject": "Cold food",
//   "description": "Food was cold and not fresh",
//   "priority": "medium"         // optional: low, medium, high
// }
router.post('/complaint', submitComplaint);

// GET /api/student/complaints/:studentId - Get all complaints by a student
// URL parameter: studentId
router.get('/complaints/:studentId', getMyComplaints);

// Export the router
module.exports = router;
