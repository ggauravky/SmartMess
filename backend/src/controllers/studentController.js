// Student Controller - Handles all student-related operations

const { getSupabase } = require('../config/database');

// ============================================
// 1. GET TODAY'S MENU
// ============================================
// This function fetches the menu for today's date
const getTodaysMenu = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Step 1: Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
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
    
    // Convert to YYYY-MM-DD format
    const todayStr = today.toISOString().split('T')[0];
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
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
        rating_date: new Date().toISOString()
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
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
  getTodaysMenu,
  getMenuByDate,
  getWeeklyMenu,
  submitRating,
  submitComplaint,
  getMyComplaints
};
