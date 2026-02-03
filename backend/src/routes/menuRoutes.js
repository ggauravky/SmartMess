const express = require("express");
const router = express.Router();
const { supabase } = require("../config/database");

// Helper to get day name
const getDayName = (date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date(date).getDay()];
};

// Get today's menu
router.get("/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("menus")
      .select("*")
      .eq("date", today)
      .maybeSingle();
    res.json({ success: true, menu: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get weekly menu
router.get("/weekly", async (req, res) => {
  try {
    const { data } = await supabase
      .from("menus")
      .select("*")
      .order("date", { ascending: true })
      .limit(7);
    res.json({ success: true, menus: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get menu by date
router.get("/date/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .eq("date", date)
      .maybeSingle();

    if (error) throw error;

    res.json({
      success: true,
      menu: data,
    });
  } catch (error) {
    console.error("Get menu by date error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create/Update menu (Admin)
router.post("/", async (req, res) => {
  try {
    const { date, breakfast, lunch, snacks, dinner } = req.body;
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = days[new Date(date).getDay()];

    const { data, error } = await supabase
      .from("menus")
      .upsert(
        { date, day, breakfast, lunch, snacks, dinner },
        {
          onConflict: "date",
        },
      )
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, menu: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
