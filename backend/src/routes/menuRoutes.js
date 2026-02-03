const express = require("express");
const router = express.Router();
const { supabase } = require("../config/database");

// Helper: Get local date string (YYYY-MM-DD format)
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
    const today = getLocalDateString();
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

// Get all menus (Admin)
router.get("/", async (req, res) => {
  try {
    const { data } = await supabase
      .from("menus")
      .select("*")
      .order("date", { ascending: false })
      .limit(30);
    res.json({ success: true, menus: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update menu
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, breakfast, lunch, snacks, dinner, special_note } = req.body;
    const day = getDayName(date);

    const { data, error } = await supabase
      .from("menus")
      .update({ date, day, breakfast, lunch, snacks, dinner, special_note, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, menu: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete menu
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("menus")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ success: true, message: "Menu deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
