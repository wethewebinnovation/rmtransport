import express from "express";
import { pool } from "../config/database.js";
import bcrypt from "bcryptjs"; // or "bcrypt"

const router = express.Router();

// Get all users (for accounts list)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, username FROM users");
    res.json(rows);
  } catch (err) {
    console.error("GET /users error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username and password required" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [username, hash]
    );
    res.status(201).json({ message: "Account created" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Username already exists" });
    }
    console.error("POST /users/register error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

router.put("/reset-password", async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res
        .status(400)
        .json({ error: "Username and new password are required" });
    }

    // Hash new password
    const hash = await bcrypt.hash(newPassword, 10);

    // Update password_hash for the user
    const [result] = await pool.query(
      "UPDATE users SET password_hash = ? WHERE username = ?",
      [hash, username]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("PUT /users/reset-password error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
