const db = require("../config/database");

// Get today's menu
exports.getTodayMenu = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const [rows] = await db.query("SELECT * FROM menus WHERE date = ?", [
      today,
    ]);

    if (rows.length === 0) {
      return res.json({
        success: false,
        message: "No menu available for today",
        menu: null,
      });
    }

    const menu = rows[0];
    // Parse JSON fields
    menu.breakfast = JSON.parse(menu.breakfast || "[]");
    menu.lunch = JSON.parse(menu.lunch || "[]");
    menu.snacks = JSON.parse(menu.snacks || "[]");
    menu.dinner = JSON.parse(menu.dinner || "[]");

    res.json({
      success: true,
      menu,
    });
  } catch (error) {
    console.error("Error fetching today's menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu",
    });
  }
};

// Get menu by date
exports.getMenuByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const [rows] = await db.query("SELECT * FROM menus WHERE date = ?", [date]);

    if (rows.length === 0) {
      return res.json({
        success: false,
        message: "No menu found for this date",
        menu: null,
      });
    }

    const menu = rows[0];
    menu.breakfast = JSON.parse(menu.breakfast || "[]");
    menu.lunch = JSON.parse(menu.lunch || "[]");
    menu.snacks = JSON.parse(menu.snacks || "[]");
    menu.dinner = JSON.parse(menu.dinner || "[]");

    res.json({
      success: true,
      menu,
    });
  } catch (error) {
    console.error("Error fetching menu by date:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu",
    });
  }
};

// Get weekly menu
exports.getWeeklyMenu = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const [rows] = await db.query(
      "SELECT * FROM menus WHERE date BETWEEN ? AND ? ORDER BY date ASC",
      [
        startOfWeek.toISOString().split("T")[0],
        endOfWeek.toISOString().split("T")[0],
      ],
    );

    const menus = rows.map((menu) => ({
      ...menu,
      breakfast: JSON.parse(menu.breakfast || "[]"),
      lunch: JSON.parse(menu.lunch || "[]"),
      snacks: JSON.parse(menu.snacks || "[]"),
      dinner: JSON.parse(menu.dinner || "[]"),
    }));

    res.json({
      success: true,
      menus,
    });
  } catch (error) {
    console.error("Error fetching weekly menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly menu",
    });
  }
};

// Get all menus
exports.getAllMenus = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM menus ORDER BY date DESC");

    const menus = rows.map((menu) => ({
      ...menu,
      breakfast: JSON.parse(menu.breakfast || "[]"),
      lunch: JSON.parse(menu.lunch || "[]"),
      snacks: JSON.parse(menu.snacks || "[]"),
      dinner: JSON.parse(menu.dinner || "[]"),
    }));

    res.json({
      success: true,
      menus,
    });
  } catch (error) {
    console.error("Error fetching all menus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menus",
    });
  }
};

// Create menu
exports.createMenu = async (req, res) => {
  try {
    const { date, day_name, breakfast, lunch, snacks, dinner } = req.body;

    const [result] = await db.query(
      `INSERT INTO menus (date, day_name, breakfast, lunch, snacks, dinner, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        date,
        day_name,
        JSON.stringify(breakfast || []),
        JSON.stringify(lunch || []),
        JSON.stringify(snacks || []),
        JSON.stringify(dinner || []),
        req.user?.id || null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Menu created successfully",
      menuId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Menu already exists for this date",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create menu",
    });
  }
};

// Update menu
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { breakfast, lunch, snacks, dinner } = req.body;

    await db.query(
      `UPDATE menus SET breakfast = ?, lunch = ?, snacks = ?, dinner = ? WHERE id = ?`,
      [
        JSON.stringify(breakfast || []),
        JSON.stringify(lunch || []),
        JSON.stringify(snacks || []),
        JSON.stringify(dinner || []),
        id,
      ],
    );

    res.json({
      success: true,
      message: "Menu updated successfully",
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update menu",
    });
  }
};

// Delete menu
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM menus WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete menu",
    });
  }
};
