const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { supabase } = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "smartmess_fallback_secret";

const generateToken = (user, role) => {
  return jwt.sign({ id: user.id, email: user.email, role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    console.log("📝 Register:", req.body);
    const {
      name,
      email,
      password,
      rollNumber,
      hostelName,
      roomNumber,
      phoneNumber,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !rollNumber ||
      !hostelName ||
      !roomNumber ||
      !phoneNumber
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check existing
    const { data: existing } = await supabase
      .from("students")
      .select("id")
      .or(`email.eq.${email},roll_number.eq.${rollNumber}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email or Roll Number already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: student, error } = await supabase
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
          is_verified: true,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("DB Error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    const token = generateToken(student, "student");

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        rollNumber: student.roll_number,
        role: "student",
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("🔐 Login:", req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("email", email)
      .single();

    if (!student) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, student.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(student, "student");

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        rollNumber: student.roll_number,
        role: "student",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADMIN LOGIN
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }

    const token = generateToken(admin, "admin");

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ME
router.get("/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const table = decoded.role === "admin" ? "admins" : "students";

    const { data: user } = await supabase
      .from(table)
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rollNumber: user.roll_number,
        role: decoded.role,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

module.exports = router;
