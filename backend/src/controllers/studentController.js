// Student Controller - Handles all student-related operations

const { getSupabase } = require('../config/database');

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
// 1. GET TODAY'S MENU
// ============================================
// This function fetches the menu for today's date
const getTodaysMenu = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Step 1: Get today's date in YYYY-MM-DD format (using local time)
    const today = getLocalDateString();
    
    // Step 2: Fetch menu from database for today's date
    const { data: menu, error } = await supabase
      .from('menus')
      .select('*')
      .eq('date', today)
      .single();
    
    // Step 3: Check if menu exists for today
    if (error || !menu) {
      return res.status(404).json({
        success: false,
        message: 'No menu available for today'
      });
    }
    
    // Step 4: Send menu in response
    res.status(200).json({
      success: true,
      message: 'Today\'s menu fetched successfully',
      data: menu
    });
    
  } catch (error) {
    console.error('Error in getTodaysMenu:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu',
      error: error.message
    });
  }
};

// ============================================
// 2. GET MENU BY DATE
// ============================================
// This function fetches menu for a specific date
const getMenuByDate = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Step 1: Get date from query parameter (?date=2026-02-03)
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }
    
    // Step 2: Fetch menu from database
    const { data: menu, error } = await supabase
      .from('menus')
      .select('*')
      .eq('date', date)
      .single();
    
    if (error || !menu) {
      return res.status(404).json({
        success: false,
        message: `No menu available for ${date}`
      });
    }
    
    // Step 3: Send menu in response
    res.status(200).json({
      success: true,
      message: 'Menu fetched successfully',
      data: menu
    });
    
  } catch (error) {
    console.error('Error in getMenuByDate:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu',
      error: error.message
    });
  }
};

// ============================================
// 3. GET WEEKLY MENU
// ============================================
// Get menu for next 7 days
const getWeeklyMenu = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Step 1: Get today's date
    const today = new Date();
    
    // Step 2: Get date 7 days from now
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    // Convert to YYYY-MM-DD format (using local time)
    const todayStr = getLocalDateString(today);
    const nextWeekStr = getLocalDateString(nextWeek);
    
    // Step 3: Fetch all menus between today and next week
    const { data: menus, error } = await supabase
      .from('menus')
      .select('*')
      .gte('date', todayStr)  // Greater than or equal to today
      .lte('date', nextWeekStr)  // Less than or equal to next week
      .order('date', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    // Step 4: Send menus in response
    res.status(200).json({
      success: true,
      message: 'Weekly menu fetched successfully',
      count: menus.length,
      data: menus
    });
    
  } catch (error) {
    console.error('Error in getWeeklyMenu:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly menu',
      error: error.message
    });
  }
};

// ============================================
// 4. SUBMIT RATING
// ============================================
// Student rates a meal (breakfast/lunch/dinner)
const submitRating = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Step 1: Get data from request body
    const { studentId, menuId, mealType, rating, comment } = req.body;
    
    // Step 2: Validate required fields
    if (!studentId || !menuId || !mealType || !rating) {
      return res.status(400).json({
        success: false,
        message: 'studentId, menuId, mealType, and rating are required'
      });
    }
    
    // Step 3: Validate rating value (must be 1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Step 4: Validate meal type
    const validMealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];
    if (!validMealTypes.includes(mealType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal type. Must be: breakfast, lunch, snacks, or dinner'
      });
    }
    
    // Step 5: Check if student already rated this meal
    const { data: existingRating } = await supabase
      .from('ratings')
      .select('*')
      .eq('student_id', studentId)
      .eq('menu_id', menuId)
      .eq('meal_type', mealType)
      .single();
    
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this meal'
      });
    }
    
    // Step 6: Insert rating into database
    const { data: newRating, error: insertError } = await supabase
      .from('ratings')
      .insert([{
        student_id: studentId,
        menu_id: menuId,
        meal_type: mealType,
        rating: rating,
        comment: comment || '',
        rating_date: getLocalDateString()
      }])
      .select()
      .single();
    
    if (insertError) {
      throw insertError;
    }
    
    // Step 7: Send success response
    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: newRating
    });
    
  } catch (error) {
    console.error('Error in submitRating:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting rating',
      error: error.message
    });
  }
};

// ============================================
// 5. SUBMIT COMPLAINT
// ============================================
// Student submits a complaint about mess
const submitComplaint = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Step 1: Get data from request body
    const { studentId, category, subject, description, priority } = req.body;
    
    // Step 2: Validate required fields
    if (!studentId || !category || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'studentId, category, subject, and description are required'
      });
    }
    
    // Step 3: Validate category
    const validCategories = ['food_quality', 'hygiene', 'service', 'quantity', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be: food_quality, hygiene, service, quantity, or other'
      });
    }
    
    // Step 4: Validate priority (optional)
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority. Must be: low, medium, or high'
      });
    }
    
    // Step 5: Insert complaint into database
    const { data: newComplaint, error: insertError } = await supabase
      .from('complaints')
      .insert([{
        student_id: studentId,
        category,
        subject,
        description,
        priority: priority || 'medium',
        status: 'pending'
      }])
      .select()
      .single();
    
    if (insertError) {
      throw insertError;
    }
    
    // Step 6: Send success response
    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: newComplaint
    });
    
  } catch (error) {
    console.error('Error in submitComplaint:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting complaint',
      error: error.message
    });
  }
};

// ============================================
// 6. GET STUDENT'S COMPLAINTS
// ============================================
// Get all complaints submitted by a student
const getMyComplaints = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Step 1: Get student ID from URL parameter
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }
    
    // Step 2: Fetch all complaints by this student
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Step 3: Send complaints in response
    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
    
  } catch (error) {
    console.error('Error in getMyComplaints:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints',
      error: error.message
    });
  }
};

// ============================================
// 7. MEAL ATTENDANCE FUNCTIONS
// ============================================

// Mark attendance for a meal
const markMealAttendance = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { studentId, date, mealType, status } = req.body;

    if (!studentId || !date || !mealType || !status) {
      return res.status(400).json({
        success: false,
        message: 'studentId, date, mealType, and status are required'
      });
    }

    // Validate meal type
    const validMealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];
    if (!validMealTypes.includes(mealType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal type'
      });
    }

    // Validate status
    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be present or absent'
      });
    }

    // Upsert attendance (insert or update)
    const { data: attendance, error } = await supabase
      .from('meal_attendance')
      .upsert({
        student_id: studentId,
        date,
        meal_type: mealType,
        status,
        marked_at: new Date().toISOString()
      }, {
        onConflict: 'student_id,date,meal_type'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `Attendance marked as ${status} for ${mealType}`,
      data: attendance
    });

  } catch (error) {
    console.error('Error in markMealAttendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

// Get my attendance history
const getMyAttendance = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('meal_attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: attendance, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });

  } catch (error) {
    console.error('Error in getMyAttendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    });
  }
};

// Get today's attendance status for a student
const getTodayAttendanceStatus = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { studentId } = req.params;
    
    // Use local date helper to avoid timezone issues
    const today = getLocalDateString();
    
    console.log('📅 Fetching attendance for date:', today, 'studentId:', studentId);

    const { data: attendance, error } = await supabase
      .from('meal_attendance')
      .select('*')
      .eq('student_id', studentId)
      .eq('date', today);

    if (error) throw error;

    // Create a map of meal type to status
    const statusMap = {};
    const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];
    
    mealTypes.forEach(type => {
      const record = (attendance || []).find(a => a.meal_type === type);
      statusMap[type] = record ? record.status : null;
    });

    res.status(200).json({
      success: true,
      date: today,
      data: statusMap
    });

  } catch (error) {
    console.error('Error in getTodayAttendanceStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance status',
      error: error.message
    });
  }
};

// ============================================
// 8. NOTIFICATION FUNCTIONS
// ============================================

// Get all notifications for students
const getNotifications = async (req, res) => {
  try {
    const supabase = getSupabase();
    const studentId = req.user?.id;

    // Fetch all active notifications
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Handle case where table doesn't exist
    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
          message: 'No notifications table found. Please run database migrations.'
        });
      }
      throw error;
    }

    // If student is logged in, also fetch read status
    let readNotificationIds = [];
    if (studentId) {
      const { data: reads } = await supabase
        .from('notification_reads')
        .select('notification_id')
        .eq('student_id', studentId);
      
      readNotificationIds = (reads || []).map(r => r.notification_id);
    }

    // Add isRead flag to each notification
    const notificationsWithStatus = (notifications || []).map(n => ({
      ...n,
      isRead: readNotificationIds.includes(n.id)
    }));

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notificationsWithStatus
    });

  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Mark notification as read
const markNotificationRead = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { notificationId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: 'Student ID required'
      });
    }

    const { data, error } = await supabase
      .from('notification_reads')
      .upsert({
        notification_id: notificationId,
        student_id: studentId,
        read_at: new Date().toISOString()
      }, {
        onConflict: 'notification_id,student_id'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Error in markNotificationRead:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const supabase = getSupabase();
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: 'Student ID required'
      });
    }

    // Get total notifications
    const { count: totalCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get read notifications count
    const { count: readCount } = await supabase
      .from('notification_reads')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId);

    const unreadCount = (totalCount || 0) - (readCount || 0);

    res.status(200).json({
      success: true,
      data: {
        total: totalCount || 0,
        read: readCount || 0,
        unread: unreadCount > 0 ? unreadCount : 0
      }
    });

  } catch (error) {
    console.error('Error in getUnreadCount:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
  getTodaysMenu,
  getMenuByDate,
  getWeeklyMenu,
  submitRating,
  submitComplaint,
  getMyComplaints,
  // Meal Attendance
  markMealAttendance,
  getMyAttendance,
  getTodayAttendanceStatus,
  // Notifications
  getNotifications,
  markNotificationRead,
  getUnreadCount
};
