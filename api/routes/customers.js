import express from "express";
import { pool } from "../config/database.js";

const router = express.Router();

// GET all customers
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM customers ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET /customers error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET customer by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length)
      return res.status(404).json({ error: "Customer not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /customers/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE new customer
router.post("/", async (req, res) => {
  try {
    const { customer_name, mobile, gst_number, place, address } = req.body;
    await pool.query(
      "INSERT INTO customers (customer_name, mobile, gst_number, place, address) VALUES (?, ?, ?, ?, ?)",
      [customer_name, mobile, gst_number, place, address]
    );
    res.status(201).json({ message: "Customer created" });
  } catch (err) {
    console.error("POST /customers error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE customer
router.put("/:id", async (req, res) => {
  try {
    const { customer_name, mobile, gst_number, place, address } = req.body;
    const [result] = await pool.query(
      "UPDATE customers SET customer_name=?, mobile=?, gst_number=?, place=?, address=? WHERE id=?",
      [customer_name, mobile, gst_number, place, address, req.params.id]
    );
    if (!result.affectedRows)
      return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer updated" });
  } catch (err) {
    console.error("PUT /customers/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE customer
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM customers WHERE id=?", [
      req.params.id,
    ]);
    if (!result.affectedRows)
      return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    console.error("DELETE /customers/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
