import { pool } from "../config/database.js";

export async function generateLrNumber() {
  const conn = await pool.getConnection();
  try {
    // Fetch last saved LR number
    let [rows] = await conn.query(
      "SELECT last_number FROM lr_number_counter WHERE id=1"
    );
    let lastNumber = rows.length ? rows[0].last_number : 0;

    // Increment the last number to get new LR number sequence
    lastNumber++;

    // Format LR number: "RM/YYYY/MM/XX", zero-padding month and sequence
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const seq = String(lastNumber).padStart(2, "0");

    return `RM/${year}/${month}/${seq}`;
  } finally {
    conn.release();
  }
}

export async function saveLrNumber() {
  console.log("save called6");
  const conn = await pool.getConnection();
  try {
    // Fetch last saved LR number
    let [rows] = await conn.query(
      "SELECT last_number FROM lr_number_counter WHERE id=1"
    );
    let lastNumber = rows.length ? rows[0].last_number : 0;

    // Increment the last number to get new LR number sequence
    lastNumber++;

    // Update or insert the new last number
    if (rows.length) {
      await conn.query(
        "UPDATE lr_number_counter SET last_number=? WHERE id=1",
        [lastNumber]
      );
    } else {
      await conn.query(
        "INSERT INTO lr_number_counter (id, last_number) VALUES (1, ?)",
        [lastNumber]
      );
    }
  } finally {
    conn.release();
  }
}
