import express from "express";
import { pool } from "../config/database.js";
import { generateLrNumber, saveLrNumber } from "../utils/lrNumberGenerator.js";

const router = express.Router();

/**
 * Format a given date string into IST (yyyy-mm-dd hh:mm:ss)
 */
function formatDateTimeIST(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);

  // Apply IST offset (+5:30 = 330 mins)
  const istOffset = 330; // minutes
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const ist = new Date(utc + istOffset * 60000);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    ist.getFullYear() + "-" + pad(ist.getMonth() + 1) + "-" + pad(ist.getDate())
  );
}

router.get("/generateLrNumber", async (req, res) => {
  try {
    const lrNumber = await generateLrNumber();
    res.json(lrNumber);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate LR number" });
  }
});

// GET all bills (optionally filter by status)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM lrbills";
    const params = [];
    if (status) {
      query += " WHERE status = ?";
      params.push(status);
    }
    query += " ORDER BY created_at DESC";
    const [rows] = await pool.query(query, params);

    // Format dates in IST
    const formattedRows = rows.map((row) => ({
      ...row,
      date: formatDateTimeIST(row.date),
      created_at: formatDateTimeIST(row.created_at),
    }));

    res.json(formattedRows);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

// GET bill by id (include its products)
router.get("/:id", async (req, res) => {
  try {
    const [bills] = await pool.query("SELECT * FROM lrbills WHERE id = ?", [
      req.params.id,
    ]);
    if (!bills.length) return res.status(404).json({ error: "Bill not found" });
    const bill = bills[0];

    bill.date = formatDateTimeIST(bill.date);
    bill.created_at = formatDateTimeIST(bill.created_at);

    const [products] = await pool.query(
      "SELECT * FROM lrbill_products WHERE bill_id = ?",
      [req.params.id]
    );
    bill.products = products;
    res.json(bill);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE bill (with auto LR number and products/snapshots)
router.post("/", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const verifyIrNumber = await generateLrNumber();

    const {
      date, // YYYY-MM-DD
      from_customer_id,
      from_customer_name,
      from_customer_place,
      from_customer_mobile,
      from_customer_gst,
      to_customer_id,
      to_customer_name,
      to_customer_place,
      to_customer_mobile,
      to_customer_gst,
      lorry_id,
      lorry_name,
      lorry_number,
      driver_id,
      driver_name,
      driver_number,
      payment_status,
      eway_bill_number,
      subtotal_amount,
      sgst_amount,
      cgst_amount,
      total_amount,
      products,
      lr_number,
    } = req.body;

    if (verifyIrNumber == lr_number) {
      await saveLrNumber();

      // Insert bill snapshot record
      const [result] = await conn.query(
        `INSERT INTO lrbills (
        lr_number, date,
        from_customer_id, from_customer_name, from_customer_place, from_customer_mobile, from_customer_gst,
        to_customer_id, to_customer_name, to_customer_place, to_customer_mobile, to_customer_gst,
        lorry_id, lorry_name, lorry_number,
        driver_id, driver_name, driver_number,
        payment_status, eway_bill_number, subtotal_amount, sgst_amount, cgst_amount, total_amount, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          lr_number,
          formatDateTimeIST(date), // format input date
          from_customer_id,
          from_customer_name,
          from_customer_place,
          from_customer_mobile,
          from_customer_gst,
          to_customer_id,
          to_customer_name,
          to_customer_place,
          to_customer_mobile,
          to_customer_gst,
          lorry_id,
          lorry_name,
          lorry_number,
          driver_id,
          driver_name,
          driver_number,
          payment_status,
          eway_bill_number,
          subtotal_amount,
          sgst_amount,
          cgst_amount,
          total_amount,
        ]
      );

      const billId = result.insertId;
      // Insert bill product lines
      for (const p of products || []) {
        await conn.query(
          `INSERT INTO lrbill_products
          (bill_id, product_id, product_name, description, quantity, amount, discount)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            billId,
            p.product_id || null,
            p.product_name || null,
            p.description || "",
            p.quantity || 0,
            p.amount || 0,
            p.discount || 0,
          ]
        );
      }

      await conn.commit();
      res.status(201).json({ message: "Bill created", lr_number });
    } else {
      await conn.rollback();
      res.status(405).json({ error: "lr_number mismatch" });
    }
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: "Database error", details: `${err}` });
  } finally {
    conn.release();
  }
});

// UPDATE bill (including products)
router.put("/:id", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      date,
      from_customer_id,
      from_customer_name,
      from_customer_place,
      from_customer_mobile,
      from_customer_gst,
      to_customer_id,
      to_customer_name,
      to_customer_place,
      to_customer_mobile,
      to_customer_gst,
      lorry_id,
      lorry_name,
      lorry_number,
      driver_id,
      driver_name,
      driver_number,
      payment_status,
      eway_bill_number,
      subtotal_amount,
      sgst_amount,
      cgst_amount,
      total_amount,
      products,
    } = req.body;

    const [result] = await conn.query(
      `UPDATE lrbills SET
        date=?, from_customer_id=?, from_customer_name=?, from_customer_place=?, from_customer_mobile=?, from_customer_gst=?,
        to_customer_id=?, to_customer_name=?, to_customer_place=?, to_customer_mobile=?, to_customer_gst=?,
        lorry_id=?, lorry_name=?, lorry_number=?,
        driver_id=?, driver_name=?, driver_number=?,
        payment_status=?, eway_bill_number=?, subtotal_amount=?, sgst_amount=?, cgst_amount=?, total_amount=?
        WHERE id=?`,
      [
        formatDateTimeIST(date),
        from_customer_id,
        from_customer_name,
        from_customer_place,
        from_customer_mobile,
        from_customer_gst,
        to_customer_id,
        to_customer_name,
        to_customer_place,
        to_customer_mobile,
        to_customer_gst,
        lorry_id,
        lorry_name,
        lorry_number,
        driver_id,
        driver_name,
        driver_number,
        payment_status,
        eway_bill_number,
        subtotal_amount,
        sgst_amount,
        cgst_amount,
        total_amount,
        req.params.id,
      ]
    );
    if (!result.affectedRows) {
      await conn.rollback();
      return res.status(404).json({ error: "Bill not found" });
    }

    // Remove old products
    await conn.query("DELETE FROM lrbill_products WHERE bill_id=?", [
      req.params.id,
    ]);
    // Insert updated products
    for (const p of products || []) {
      await conn.query(
        `INSERT INTO lrbill_products
          (bill_id, product_id, product_name, description, quantity, amount, discount)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          req.params.id,
          p.product_id || null,
          p.product_name || null,
          p.description || "",
          p.quantity || 0,
          p.amount || 0,
          p.discount || 0,
        ]
      );
    }
    await conn.commit();
    res.json({ message: "Bill updated" });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: "Database error", details: `${err}` });
  } finally {
    conn.release();
  }
});

// SOFT DELETE (move to trash)
router.put("/:id/trash", async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE lrbills SET status='trash' WHERE id=?",
      [req.params.id]
    );
    if (!result.affectedRows)
      return res.status(404).json({ error: "Bill not found" });
    res.json({ message: "Bill moved to trash" });
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

// RESTORE from trash
router.put("/:id/restore", async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE lrbills SET status='active' WHERE id=?",
      [req.params.id]
    );
    if (!result.affectedRows)
      return res.status(404).json({ error: "Bill not found" });
    res.json({ message: "Bill restored from trash" });
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

// PERMANENT DELETE
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM lrbills WHERE id = ?", [
      req.params.id,
    ]);
    if (!result.affectedRows)
      return res.status(404).json({ error: "Bill not found" });
    res.json({ message: "Bill deleted permanently" });
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
