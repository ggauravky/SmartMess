const mongoose = require("mongoose");
const Admin = require("../models/Admin");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@smartmess.com" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      console.log("Email: admin@smartmess.com");
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      name: "Admin",
      email: "admin@smartmess.com",
      password: "admin123", // Change this in production!
    });

    await admin.save();

    console.log("✅ Admin created successfully!");
    console.log("📧 Email: admin@smartmess.com");
    console.log("🔑 Password: admin123");
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
