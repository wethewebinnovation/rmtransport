import express from "express";
import { pool } from "../config/database.js";

const router = express.Router();

// GET settings (only first row)
router.get("/", async (req, res) => {
  try {
    // Select the company_gst field as well
    const [rows] = await pool.query("SELECT * FROM settings LIMIT 1");
    if (!rows.length)
      return res.status(404).json({ error: "Settings not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /settings error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE settings (row id=1)
router.put("/", async (req, res) => {
  try {
    // Destructure company_gst from request body
    const {
      company_name,
      company_address,
      company_phones,
      company_gst,
      gst_percentage,
      gst_included,
      terms_conditions,
    } = req.body;
    const [result] = await pool.query(
      "UPDATE settings SET company_name=?, company_address=?, company_phones=?, company_gst=?, gst_percentage=?, gst_included=?, terms_conditions=? WHERE id=1",
      [
        company_name,
        company_address,
        company_phones,
        company_gst,
        gst_percentage,
        gst_included,
        terms_conditions,
      ]
    );
    if (!result.affectedRows)
      return res.status(404).json({ error: "Settings not found" });
    res.json({ message: "Settings updated" });
  } catch (err) {
    console.error("PUT /settings error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
