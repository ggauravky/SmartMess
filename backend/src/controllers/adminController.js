// Admin Controller - Handles all admin-related operations (Supabase version)

const { getSupabase } = require("../config/database");
const bcrypt = require("bcryptjs");

// ============================================
// HELPER: Get local date string (YYYY-MM-DD format)
// This avoids UTC timezone issues
// ============================================
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ============================================
// DASHBOARD STATS
// ============================================
const getDashboardStats = async (req, res) => {
  try {
    const supabase = getSupabase();

    // Get total students
    const { count: totalStudents } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true });

    // Get verified students
    const { count: verifiedStudents } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("is_verified", true);

    // Get total ratings
    const { count: totalRatings } = await supabase
      .from("ratings")
      .select("*", { count: "exact", head: true });

    // Get average rating
    const { data: ratingData } = await supabase
      .from("ratings")
      .select("rating");

    const avgRating =
      ratingData && ratingData.length > 0
        ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
        : 0;

    // Get today's ratings
    const today = getLocalDateString();
    const { count: todayRatings } = await supabase
      .from("ratings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00`)
      .lt("created_at", `${today}T23:59:59`);

    // Get pending complaints
    const { count: pendingComplaints } = await supabase
      .from("complaints")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // Get total menus
    const { count: totalMenus } = await supabase
      .from("menus")
      .select("*", { count: "exact", head: true });

    res.json({
      success: true,
      data: {
        totalStudents: totalStudents || 0,
        verifiedStudents: verifiedStudents || 0,
        totalRatings: totalRatings || 0,
        avgRating: avgRating.toFixed(1),
        todayRatings: todayRatings || 0,
        pendingComplaints: pendingComplaints || 0,
        totalMenus: totalMenus || 0,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

// ============================================
// STUDENT MANAGEMENT
// ============================================
const addStudent = async (req, res) => {
  try {
    const supabase = getSupabase();
    const {
      name,
      email,
      rollNumber,
      password,
      hostelName,
      roomNumber,
      phoneNumber,
    } = req.body;

    if (
      !name ||
      !email ||
      !rollNumber ||
      !password ||
      !hostelName ||
      !roomNumber ||
      !phoneNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if student exists
    const { data: existing } = await supabase
      .from("students")
      .select("id")
      .or(`email.eq.${email},roll_number.eq.${rollNumber}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Student with this email or roll number already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newStudent, error } = await supabase
      .from("students")
      .insert([
        {
          name,
          email,
          roll_number: rollNumber,
          password: hashedPassword,
          hostel_name: hostelName,
          room_number: roomNumber,
          phone_number: phoneNumber,
          is_verified: false,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        rollNumber: newStudent.roll_number,
        isVerified: newStudent.is_verified,
      },
    });
  } catch (error) {
    console.error("Error in addStudent:", error);
    res.status(500).json({
      success: false,
      message: "Error adding student",
      error: error.message,
    });
  }
};

const verifyStudent = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { studentId } = req.params;

    const { data: student, error: fetchError } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single();

    if (fetchError || !student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Student is already verified",
      });
    }

    const { data: updatedStudent, error } = await supabase
      .from("students")
      .update({ is_verified: true })
      .eq("id", studentId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Student verified successfully",
      data: {
        id: updatedStudent.id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        isVerified: updatedStudent.is_verified,
      },
    });
  } catch (error) {
    console.error("Error in verifyStudent:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying student",
      error: error.message,
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { verified } = req.query;

    let query = supabase
      .from("students")
      .select(
        "id, name, email, roll_number, hostel_name, room_number, phone_number, is_verified, is_active, created_at"
      )
      .order("created_at", { ascending: false });

    if (verified !== undefined) {
      query = query.eq("is_verified", verified === "true");
    }

    const { data: students, error } = await query;

    if (error) throw error;

    // Get ratings count for each student
    const studentsWithRatings = await Promise.all(
      students.map(async (student) => {
        const { count } = await supabase
          .from("ratings")
          .select("*", { count: "exact", head: true })
          .eq("student_id", student.id);

        return {
          ...student,
          ratingsCount: count || 0,
        };
      })
    );

    res.json({
      success: true,
      count: students.length,
      data: studentsWithRatings,
    });
  } catch (error) {
    console.error("Error in getAllStudents:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { studentId } = req.params;

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", studentId);

    if (error) throw error;

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteStudent:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: error.message,
    });
  }
};

const toggleStudentStatus = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { studentId } = req.params;

    const { data: student } = await supabase
      .from("students")
      .select("is_active")
      .eq("id", studentId)
      .single();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const { data: updatedStudent, error } = await supabase
      .from("students")
      .update({ is_active: !student.is_active })
      .eq("id", studentId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: `Student ${updatedStudent.is_active ? "activated" : "deactivated"} successfully`,
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error in toggleStudentStatus:", error);
    res.status(500).json({
      success: false,
      message: "Error updating student status",
      error: error.message,
    });
  }
};

// ============================================
// MENU MANAGEMENT
// ============================================
const addMenu = async (req, res) => {
  try {
    const supabase = getSupabase();
    console.log("📋 Add Menu Request Body:", JSON.stringify(req.body, null, 2));
    
    const { date, day, breakfast, lunch, snacks, dinner, specialNote } =
      req.body;

    if (!date || !day) {
      return res.status(400).json({
        success: false,
        message: "Date and day are required",
      });
    }

    // Ensure arrays are valid (even if empty)
    const menuData = {
      date,
      day,
      breakfast: Array.isArray(breakfast) ? breakfast : [],
      lunch: Array.isArray(lunch) ? lunch : [],
      snacks: Array.isArray(snacks) ? snacks : [],
      dinner: Array.isArray(dinner) ? dinner : [],
      special_note: specialNote || "",
    };

    console.log("📋 Menu Data to save:", JSON.stringify(menuData, null, 2));

    // Check if menu exists for this date
    const { data: existingMenu } = await supabase
      .from("menus")
      .select("*")
      .eq("date", date)
      .single();

    if (existingMenu) {
      // Update existing menu
      const { data: updatedMenu, error } = await supabase
        .from("menus")
        .update({
          day: menuData.day,
          breakfast: menuData.breakfast,
          lunch: menuData.lunch,
          snacks: menuData.snacks,
          dinner: menuData.dinner,
          special_note: menuData.special_note,
        })
        .eq("date", date)
        .select()
        .single();

      if (error) {
        console.error("Update menu error:", error);
        throw error;
      }

      return res.json({
        success: true,
        message: "Menu updated successfully",
        data: updatedMenu,
      });
    }

    // Create new menu
    const { data: newMenu, error } = await supabase
      .from("menus")
      .insert([menuData])
      .select()
      .single();

    if (error) {
      console.error("Insert menu error:", error);
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Menu added successfully",
      data: newMenu,
    });
  } catch (error) {
    console.error("Error in addMenu:", error);
    res.status(500).json({
      success: false,
      message: "Error adding menu",
      error: error.message,
    });
  }
};

const updateMenu = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { menuId } = req.params;
    const { breakfast, lunch, snacks, dinner, specialNote } = req.body;

    const { data: updatedMenu, error } = await supabase
      .from("menus")
      .update({
        breakfast,
        lunch,
        snacks,
        dinner,
        special_note: specialNote,
      })
      .eq("id", menuId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Menu updated successfully",
      data: updatedMenu,
    });
  } catch (error) {
    console.error("Error in updateMenu:", error);
    res.status(500).json({
      success: false,
      message: "Error updating menu",
      error: error.message,
    });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { menuId } = req.params;

    const { error } = await supabase.from("menus").delete().eq("id", menuId);

    if (error) throw error;

    res.json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteMenu:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting menu",
      error: error.message,
    });
  }
};

// ============================================
// RATINGS MANAGEMENT
// ============================================
const getAllRatings = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { mealType, startDate, endDate, limit = 50 } = req.query;

    let query = supabase
      .from("ratings")
      .select(
        `
        *,
        students:student_id (name, email, roll_number),
        menus:menu_id (date, day)
      `
      )
      .order("created_at", { ascending: false })
      .limit(parseInt(limit));

    if (mealType) {
      query = query.eq("meal_type", mealType);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data: ratings, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: ratings.length,
      data: ratings,
    });
  } catch (error) {
    console.error("Error in getAllRatings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching ratings",
      error: error.message,
    });
  }
};

const getRatingStats = async (req, res) => {
  try {
    const supabase = getSupabase();

    // Get ratings by meal type
    const { data: ratings } = await supabase.from("ratings").select("*");

    const mealTypes = ["breakfast", "lunch", "snacks", "dinner"];
    const stats = {};

    mealTypes.forEach((type) => {
      const mealRatings = (ratings || []).filter((r) => r.meal_type === type);
      const avg =
        mealRatings.length > 0
          ? mealRatings.reduce((sum, r) => sum + r.rating, 0) /
            mealRatings.length
          : 0;

      stats[type] = {
        count: mealRatings.length,
        average: avg.toFixed(1),
        distribution: {
          1: mealRatings.filter((r) => r.rating === 1).length,
          2: mealRatings.filter((r) => r.rating === 2).length,
          3: mealRatings.filter((r) => r.rating === 3).length,
          4: mealRatings.filter((r) => r.rating === 4).length,
          5: mealRatings.filter((r) => r.rating === 5).length,
        },
      };
    });

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error in getRatingStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching rating stats",
      error: error.message,
    });
  }
};

// ============================================
// COMPLAINTS MANAGEMENT
// ============================================
const getAllComplaints = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { status } = req.query;

    let query = supabase
      .from("complaints")
      .select(
        `
        *,
        students:student_id (name, email, roll_number, hostel_name, room_number)
      `
      )
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: complaints, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Error in getAllComplaints:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching complaints",
      error: error.message,
    });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { complaintId } = req.params;
    const { status, adminResponse } = req.body;

    const updateData = { status };

    if (adminResponse) {
      updateData.admin_response = adminResponse;
    }

    if (status === "resolved") {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data: updatedComplaint, error } = await supabase
      .from("complaints")
      .update(updateData)
      .eq("id", complaintId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Complaint updated successfully",
      data: updatedComplaint,
    });
  } catch (error) {
    console.error("Error in updateComplaintStatus:", error);
    res.status(500).json({
      success: false,
      message: "Error updating complaint",
      error: error.message,
    });
  }
};

// ============================================
// NOTIFICATIONS (Database implementation)
// ============================================

const sendNotification = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    const { data: notification, error } = await supabase
      .from("notifications")
      .insert([{
        title,
        message,
        type: type || "info",
        target_audience: "all",
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error in sendNotification:", error);
    res.status(500).json({
      success: false,
      message: "Error sending notification",
      error: error.message,
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const supabase = getSupabase();

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { notificationId } = req.params;

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) throw error;

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};

// ============================================
// MEAL ATTENDANCE
// ============================================
const getMealAttendance = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { date, mealType } = req.query;

    const queryDate = date || getLocalDateString();

    // Get all active students
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, name, roll_number, hostel_name, room_number")
      .eq("is_active", true)
      .eq("is_verified", true);

    if (studentsError) {
      console.error("Error fetching students:", studentsError);
    }

    // Get attendance records for this date
    let attendanceQuery = supabase
      .from("meal_attendance")
      .select("*")
      .eq("date", queryDate);

    if (mealType) {
      attendanceQuery = attendanceQuery.eq("meal_type", mealType);
    }

    const { data: attendanceRecords, error: attendanceError } = await attendanceQuery;
    
    // Handle case where table doesn't exist
    if (attendanceError) {
      if (attendanceError.code === '42P01' || attendanceError.message?.includes('does not exist')) {
        console.log('meal_attendance table does not exist yet');
      } else {
        console.error("Error fetching attendance:", attendanceError);
      }
    }

    // Create attendance map
    const attendanceMap = {};
    (attendanceRecords || []).forEach(record => {
      const key = `${record.student_id}_${record.meal_type}`;
      attendanceMap[key] = record.status;
    });

    // Map students with their attendance
    const mealTypes = mealType ? [mealType] : ['breakfast', 'lunch', 'snacks', 'dinner'];
    
    const attendanceData = (students || []).map(student => {
      const mealStatus = {};
      mealTypes.forEach(type => {
        const key = `${student.id}_${type}`;
        mealStatus[type] = attendanceMap[key] || 'not-marked';
      });
      
      return {
        ...student,
        attendance: mealStatus
      };
    });

    // Calculate stats
    const totalStudents = students?.length || 0;
    const stats = {};
    
    mealTypes.forEach(type => {
      const present = (attendanceRecords || []).filter(
        r => r.meal_type === type && r.status === 'present'
      ).length;
      const absent = (attendanceRecords || []).filter(
        r => r.meal_type === type && r.status === 'absent'
      ).length;
      
      stats[type] = {
        present,
        absent,
        notMarked: totalStudents - present - absent,
        attendanceRate: totalStudents > 0 
          ? ((present / totalStudents) * 100).toFixed(1) 
          : 0
      };
    });

    res.json({
      success: true,
      data: {
        date: queryDate,
        totalStudents,
        stats,
        students: attendanceData,
      },
    });
  } catch (error) {
    console.error("Error in getMealAttendance:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching attendance",
      error: error.message,
    });
  }
};

const getAttendanceStats = async (req, res) => {
  try {
    const supabase = getSupabase();

    const stats = [];
    const today = new Date();

    // Get total verified students
    const { count: totalStudents } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("is_verified", true);

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = getLocalDateString(date);

      // Get attendance records for this date
      const { data: records } = await supabase
        .from("meal_attendance")
        .select("meal_type, status")
        .eq("date", dateStr);

      const mealStats = {};
      ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(type => {
        const present = (records || []).filter(
          r => r.meal_type === type && r.status === 'present'
        ).length;
        mealStats[type] = present;
      });

      stats.push({
        date: dateStr,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        totalStudents: totalStudents || 0,
        ...mealStats
      });
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error in getAttendanceStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching attendance stats",
      error: error.message,
    });
  }
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
  getDashboardStats,
  addStudent,
  verifyStudent,
  getAllStudents,
  deleteStudent,
  toggleStudentStatus,
  addMenu,
  updateMenu,
  deleteMenu,
  getAllRatings,
  getRatingStats,
  getAllComplaints,
  updateComplaintStatus,
  sendNotification,
  getNotifications,
  deleteNotification,
  getMealAttendance,
  getAttendanceStats,
};
