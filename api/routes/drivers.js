import express from "express";
import { pool } from "../config/database.js";

const router = express.Router();

// GET all drivers
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM drivers ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET /drivers error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET driver by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM drivers WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length)
      return res.status(404).json({ error: "Driver not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /drivers/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE driver
router.post("/", async (req, res) => {
  try {
    const { name, driver_number, license_number, remarks } = req.body;
    await pool.query(
      "INSERT INTO drivers (name, driver_number, license_number, remarks) VALUES (?, ?, ?, ?)",
      [name, driver_number, license_number, remarks]
    );
    res.status(201).json({ message: "Driver created" });
  } catch (err) {
    console.error("POST /drivers error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE driver
router.put("/:id", async (req, res) => {
  try {
    const { name, driver_number, license_number, remarks } = req.body;
    const [result] = await pool.query(
      "UPDATE drivers SET name=?, driver_number=?, license_number=?, remarks=? WHERE id=?",
      [name, driver_number, license_number, remarks, req.params.id]
    );
    if (!result.affectedRows)
      return res.status(404).json({ error: "Driver not found" });
    res.json({ message: "Driver updated" });
  } catch (err) {
    console.error("PUT /drivers/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE driver
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM drivers WHERE id = ?", [
      req.params.id,
    ]);
    if (!result.affectedRows)
      return res.status(404).json({ error: "Driver not found" });
    res.json({ message: "Driver deleted" });
  } catch (err) {
    console.error("DELETE /drivers/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
