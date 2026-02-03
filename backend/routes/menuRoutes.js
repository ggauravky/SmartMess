const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Public routes
router.get("/today", menuController.getTodayMenu);
router.get("/date/:date", menuController.getMenuByDate);
router.get("/weekly", menuController.getWeeklyMenu);

// Protected routes
router.get("/", authenticate, menuController.getAllMenus);

// Admin only routes
router.post("/", authenticate, isAdmin, menuController.createMenu);
router.put("/:id", authenticate, isAdmin, menuController.updateMenu);
router.delete("/:id", authenticate, isAdmin, menuController.deleteMenu);

module.exports = router;
