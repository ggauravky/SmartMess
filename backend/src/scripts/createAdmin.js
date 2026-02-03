require("dotenv").config();
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

const createAdmin = async () => {
  try {
    // Get admin credentials from environment variables
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      phone_number: process.env.ADMIN_PHONE,
      role: process.env.ADMIN_ROLE,
    };

    // Check if admin exists
    const { data: existing } = await supabase
      .from("admins")
      .select("id")
      .eq("email", adminData.email)
      .single();

    if (existing) {
      console.log("⚠️  Admin already exists!");
      console.log("📧 Email:", adminData.email);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Insert admin
    const { data, error } = await supabase
      .from("admins")
      .insert([
        {
          ...adminData,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }

    console.log("✅ Admin created successfully!");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password:", adminData.password);
    console.log("\n⚠️  Change this password after first login!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdmin();
