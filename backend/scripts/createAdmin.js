/**
 * Admin User Seed Script
 * ----------------------
 * Creates an admin user directly in the database.
 * This is the ONLY way to create admin accounts — the public
 * registration endpoint always creates role="user".
 *
 * Usage:
 *   node scripts/createAdmin.js
 *
 * The script will prompt for the admin details interactively,
 * or you can set them via environment variables:
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE
 *
 * Requires: MONGODB_URL in backend/.env
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline";
import { User } from "../models/user.models.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => rl.question(prompt, resolve));

const createAdmin = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    if (!MONGODB_URL) {
      console.error("Error: MONGODB_URL not found in environment variables.");
      console.error("Make sure backend/.env exists with a valid MONGODB_URL.");
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB.\n");

    // Get admin details from env vars or prompt
    const name =
      process.env.ADMIN_NAME || (await question("Admin name: "));
    const email =
      process.env.ADMIN_EMAIL || (await question("Admin email: "));
    const password =
      process.env.ADMIN_PASSWORD || (await question("Admin password (min 8 chars): "));
    const phone =
      process.env.ADMIN_PHONE || (await question("Admin phone: "));

    if (!name || !email || !password || !phone) {
      console.error("Error: All fields are required.");
      process.exit(1);
    }

    if (password.length < 8) {
      console.error("Error: Password must be at least 8 characters.");
      process.exit(1);
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role === "admin") {
        console.log(`Admin user already exists with email: ${email}`);
      } else {
        // Upgrade existing user to admin
        existing.role = "admin";
        await existing.save();
        console.log(`Existing user ${email} has been upgraded to admin.`);
      }
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone: phone.trim(),
      role: "admin",
    });

    await admin.save();
    console.log(`\nAdmin user created successfully!`);
    console.log(`  Name:  ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Role:  ${admin.role}`);
    console.log(`\nYou can now login with these credentials.`);
  } catch (error) {
    if (error.code === 11000) {
      console.error("Error: A user with this email or phone already exists.");
    } else {
      console.error("Error creating admin:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
};

createAdmin();
