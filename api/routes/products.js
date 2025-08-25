import express from "express";
import { pool } from "../config/database.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length)
      return res.status(404).json({ error: "Product not found" });
    res.json(rows);
  } catch (err) {
    console.error("GET /products/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE product
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Product name is required" });
    }
    await pool.query("INSERT INTO products (name, description) VALUES (?, ?)", [
      name,
      description || null,
    ]);
    res.status(201).json({ message: "Product created" });
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Product name is required" });
    }
    const [result] = await pool.query(
      "UPDATE products SET name=?, description=? WHERE id=?",
      [name, description || null, req.params.id]
    );
    if (!result.affectedRows)
      return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product updated" });
  } catch (err) {
    console.error("PUT /products/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (!result.affectedRows)
      return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("DELETE /products/:id error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
