const db = require("../config/database");

// Create a rating
exports.createRating = async (req, res) => {
  try {
    const { menu_id, meal_type, rating, comment } = req.body;
    const user_id = req.user.id;

    if (!menu_id || !meal_type || !rating) {
      return res.status(400).json({
        success: false,
        message: "Menu ID, meal type, and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if user already rated this meal
    const [existing] = await db.query(
      "SELECT id FROM ratings WHERE user_id = ? AND menu_id = ? AND meal_type = ?",
      [user_id, menu_id, meal_type],
    );

    if (existing.length > 0) {
      // Update existing rating
      await db.query(
        "UPDATE ratings SET rating = ?, comment = ? WHERE id = ?",
        [rating, comment || null, existing[0].id],
      );

      return res.json({
        success: true,
        message: "Rating updated successfully",
      });
    }

    // Create new rating
    const [result] = await db.query(
      "INSERT INTO ratings (user_id, menu_id, meal_type, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [user_id, menu_id, meal_type, rating, comment || null],
    );

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      ratingId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit rating",
    });
  }
};

// Get user's ratings
exports.getMyRatings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [rows] = await db.query(
      `SELECT r.*, m.date as menu_date, m.breakfast, m.lunch, m.snacks, m.dinner
       FROM ratings r
       JOIN menus m ON r.menu_id = m.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [user_id],
    );

    const ratings = rows.map((row) => {
      const mealItems = JSON.parse(row[row.meal_type] || "[]");
      return {
        id: row.id,
        menu_id: row.menu_id,
        meal_type: row.meal_type,
        rating: row.rating,
        comment: row.comment,
        menu_date: row.menu_date,
        menu_items: mealItems,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    res.json({
      success: true,
      ratings,
    });
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ratings",
    });
  }
};

// Get rating by ID
exports.getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM ratings WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    res.json({
      success: true,
      rating: rows[0],
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rating",
    });
  }
};

// Update rating
exports.updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    // Check if rating belongs to user
    const [existing] = await db.query(
      "SELECT id FROM ratings WHERE id = ? AND user_id = ?",
      [id, user_id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Rating not found or unauthorized",
      });
    }

    await db.query("UPDATE ratings SET rating = ?, comment = ? WHERE id = ?", [
      rating,
      comment || null,
      id,
    ]);

    res.json({
      success: true,
      message: "Rating updated successfully",
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update rating",
    });
  }
};

// Delete rating
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if rating belongs to user
    const [existing] = await db.query(
      "SELECT id FROM ratings WHERE id = ? AND user_id = ?",
      [id, user_id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Rating not found or unauthorized",
      });
    }

    await db.query("DELETE FROM ratings WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Rating deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete rating",
    });
  }
};

// Get ratings for a specific meal
exports.getMealRatings = async (req, res) => {
  try {
    const { menuId, mealType } = req.params;

    const [rows] = await db.query(
      `SELECT r.*, u.name as user_name
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.menu_id = ? AND r.meal_type = ?
       ORDER BY r.created_at DESC`,
      [menuId, mealType],
    );

    res.json({
      success: true,
      ratings: rows,
    });
  } catch (error) {
    console.error("Error fetching meal ratings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ratings",
    });
  }
};

// Get average ratings analytics
exports.getAverageRatings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT meal_type, 
              AVG(rating) as average_rating, 
              COUNT(*) as total_ratings
       FROM ratings
       GROUP BY meal_type`,
    );

    res.json({
      success: true,
      analytics: rows,
    });
  } catch (error) {
    console.error("Error fetching average ratings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

// Get all ratings (admin)
exports.getAllRatings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.name as user_name, u.email as user_email, m.date as menu_date
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN menus m ON r.menu_id = m.id
       ORDER BY r.created_at DESC`,
    );

    res.json({
      success: true,
      ratings: rows,
    });
  } catch (error) {
    console.error("Error fetching all ratings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ratings",
    });
  }
};
