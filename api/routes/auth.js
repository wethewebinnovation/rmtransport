import express from "express";
import { pool } from "../config/database.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (!users.length) {
      return res.status(401).json({ error: "User doesn't exist" });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }
    // For demo, store isLoggedIn; for production, return a JWT token.
    return res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
