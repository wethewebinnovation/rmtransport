import express from "express";
import { pool } from "../config/database.js";

const router = express.Router();

// GET all lorries
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lorries ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET /lorries error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET lorry by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lorries WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Lorry not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /lorries/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE lorry
router.post("/", async (req, res) => {
  try {
    const { lorry_name, lorry_number, capacity, remarks } = req.body;
    if (!lorry_name || !lorry_number || !capacity) {
      return res
        .status(400)
        .json({ error: "Lorry Name, Number and Capacity are required" });
    }
    const [result] = await pool.query(
      "INSERT INTO lorries (lorry_name, lorry_number, capacity, remarks) VALUES (?, ?, ?, ?)",
      [lorry_name, lorry_number, capacity, remarks || null]
    );
    res.status(201).json({ message: "Lorry created", id: result.insertId });
  } catch (err) {
    console.error("POST /lorries error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE lorry
router.put("/:id", async (req, res) => {
  try {
    const { lorry_name, lorry_number, capacity, remarks } = req.body;
    if (!lorry_name || !lorry_number || !capacity) {
      return res
        .status(400)
        .json({ error: "Lorry Name, Number and Capacity are required" });
    }
    const [result] = await pool.query(
      "UPDATE lorries SET lorry_name=?, lorry_number=?, capacity=?, remarks=? WHERE id=?",
      [lorry_name, lorry_number, capacity, remarks || null, req.params.id]
    );
    if (!result.affectedRows)
      return res.status(404).json({ error: "Lorry not found" });
    res.json({ message: "Lorry updated" });
  } catch (err) {
    console.error("PUT /lorries/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE lorry
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM lorries WHERE id = ?", [
      req.params.id,
    ]);
    if (!result.affectedRows)
      return res.status(404).json({ error: "Lorry not found" });
    res.json({ message: "Lorry deleted" });
  } catch (err) {
    console.error("DELETE /lorries/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
