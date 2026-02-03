// Admin Model - Defines the structure of admin data in database

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create a Schema for Admin
const adminSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, // Only one admin with this email
      lowercase: true,
    },

    password: {
      type: String,
      required: true, // For admin login
    },

    role: {
      type: String,
      default: "admin", // Normal admin by default
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Create and export the Admin model
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
