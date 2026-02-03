const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { supabase } = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "smartmess_fallback_secret";

// Middleware to get user from token
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  try {
    const token = authHeader.replace("Bearer ", "");
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

// Create a rating
router.post("/", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
    const { menu_id, meal_type, rating, comment } = req.body;

    const { data, error } = await supabase
      .from("ratings")
      .upsert(
        {
          student_id: decoded.id,
          menu_id,
          meal_type,
          rating,
          comment: comment || "",
        },
        { onConflict: "student_id,menu_id,meal_type" },
      )
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, rating: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get my ratings
router.get("/my-ratings", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
    const { data } = await supabase
      .from("ratings")
      .select("*")
      .eq("student_id", decoded.id);
    res.json({ success: true, ratings: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all ratings (Admin)
router.get("/all", async (req, res) => {
  try {
    const { data } = await supabase
      .from("ratings")
      .select("*, students(name, roll_number)")
      .limit(100);
    res.json({ success: true, ratings: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
