// Admin Controller - Handles all admin-related operations (Supabase version)

const { getSupabase } = require('../config/database');

// ============================================
// 1. ADD NEW STUDENT
// ============================================
// This function adds a new student to the database
const addStudent = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Step 1: Get data from request body (sent by frontend)
    const { name, email, rollNumber, password, hostelName, roomNumber, phoneNumber } = req.body;
    
    // Step 2: Validate - Check if all required fields are present
    if (!name || !email || !rollNumber || !password || !hostelName || !roomNumber || !phoneNumber) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }
    
    // Step 3: Check if student with same email or roll number already exists
    const { data: existingStudent, error: checkError } = await supabase
      .from('students')
      .select('*')
      .or(`email.eq.${email},roll_number.eq.${rollNumber}`)
      .single();
    
    if (existingStudent) {
      return res.status(400).json({ 
        success: false,
        message: 'Student with this email or roll number already exists' 
      });
    }
    
    // Step 4: Create new student in database
    const { data: newStudent, error: insertError } = await supabase
      .from('students')
      .insert([{
        name,
        email,
        roll_number: rollNumber,
        password,  // Note: We'll hash this in Phase 7 (Authentication)
        hostel_name: hostelName,
        room_number: roomNumber,
        phone_number: phoneNumber,
        is_verified: false,
        is_active: true
      }])
      .select()
      .single();
    
    if (insertError) {
      throw insertError;
    }
    
    // Step 5: Send success response
    res.status(201).json({  // 201 = Created successfully
      success: true,
      message: 'Student added successfully',
      data: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        rollNumber: newStudent.roll_number,
        isVerified: newStudent.is_verified
      }
    });
    
  } catch (error) {
    // Handle any errors
    console.error('Error in addStudent:', error);
    res.status(500).json({  // 500 = Internal Server Error
      success: false,
      message: 'Error adding student',
      error: error.message
    });
  }
};

// ============================================
// 2. VERIFY STUDENT
// ============================================
// This function verifies a student (changes is_verified to true)
const verifyStudent = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Step 1: Get student ID from URL parameter
    const { studentId } = req.params;
    
    // Step 2: Find student in database
    const { data: student, error: fetchError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();
    
    // Step 3: Check if student exists
    if (fetchError || !student) {
      return res.status(404).json({  // 404 = Not Found
        success: false,
        message: 'Student not found'
      });
    }
    
    // Step 4: Check if already verified
    if (student.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Student is already verified'
      });
    }
    
    // Step 5: Update student - mark as verified
    const { data: updatedStudent, error: updateError } = await supabase
      .from('students')
      .update({ is_verified: true })
      .eq('id', studentId)
      .select()
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    // Step 6: Send success response
    res.status(200).json({
      success: true,
      message: 'Student verified successfully',
      data: {
        id: updatedStudent.id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        isVerified: updatedStudent.is_verified
      }
    });
    
  } catch (error) {
    console.error('Error in verifyStudent:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying student',
      error: error.message
    });
  }
};

// ============================================
// 3. GET ALL STUDENTS (with optional filter)
// ============================================
// Get all students or filter by verification status
const getAllStudents = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Get query parameter (optional)
    // Example: /api/admin/students?verified=false
    const { verified } = req.query;
    
    // Build query
    let query = supabase
      .from('students')
      .select('id, name, email, roll_number, hostel_name, room_number, phone_number, is_verified, is_active, created_at')
      .order('created_at', { ascending: false });
    
    // Apply filter if provided
    if (verified !== undefined) {
      query = query.eq('is_verified', verified === 'true');
    }
    
    // Execute query
    const { data: students, error } = await query;
    
    if (error) {
      throw error;
    }
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
    
  } catch (error) {
    console.error('Error in getAllStudents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// ============================================
// 4. ADD MENU
// ============================================
// This function adds daily menu to the database
const addMenu = async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Step 1: Get menu data from request body
    const { date, day, breakfast, lunch, snacks, dinner, specialNote } = req.body;
    
    // Step 2: Validate required fields
    if (!date || !day || !breakfast || !lunch || !dinner) {
      return res.status(400).json({
        success: false,
        message: 'Date, day, breakfast, lunch, and dinner are required'
      });
    }
    
    // Step 3: Check if menu for this date already exists
    const { data: existingMenu } = await supabase
      .from('menus')
      .select('*')
      .eq('date', date)
      .single();
    
    if (existingMenu) {
      return res.status(400).json({
        success: false,
        message: 'Menu for this date already exists'
      });
    }
    
    // Step 4: Create new menu
    const { data: newMenu, error: insertError } = await supabase
      .from('menus')
      .insert([{
        date,
        day,
        breakfast,
        lunch,
        snacks: snacks || { items: [], timing: "4:00 PM - 5:00 PM" },
        dinner,
        special_note: specialNote || ""
      }])
      .select()
      .single();
    
    if (insertError) {
      throw insertError;
    }
    
    // Step 5: Send success response
    res.status(201).json({
      success: true,
      message: 'Menu added successfully',
      data: newMenu
    });
    
  } catch (error) {
    console.error('Error in addMenu:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding menu',
      error: error.message
    });
  }
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
  addStudent,
  verifyStudent,
  getAllStudents,
  addMenu
};
