const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const { authenticate, isAdmin } = require("../middleware/auth");

// All rating routes require authentication
router.use(authenticate);

// User routes
router.post("/", ratingController.createRating);
router.get("/my-ratings", ratingController.getMyRatings);
router.get("/:id", ratingController.getRatingById);
router.put("/:id", ratingController.updateRating);
router.delete("/:id", ratingController.deleteRating);

// Get ratings for a specific meal
router.get("/meal/:menuId/:mealType", ratingController.getMealRatings);

// Analytics routes
router.get("/analytics/average", ratingController.getAverageRatings);

// Admin route
router.get("/all", isAdmin, ratingController.getAllRatings);

module.exports = router;
