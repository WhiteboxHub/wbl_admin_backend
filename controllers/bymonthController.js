const mysql = require("mysql2/promise");
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Get all POs by month
exports.getPOsByMonth = async (req, res) => {
  try {
    const { month } = req.query;
    const [results] = await db.query(
      `SELECT * FROM po WHERE MONTH(begindate) = ?`, [month]
    );
    res.json({ data: results, totalRows: results.length });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// Add new PO by month
exports.addPOByMonth = async (req, res) => {
  try {
    const { placementid, begindate, enddate, rate, ...otherFields } = req.body;
    const result = await db.query(
      `INSERT INTO po (placementid, begindate, enddate, rate, ...) VALUES (?, ?, ?, ?, ?)`,
      [placementid, begindate, enddate, rate, ...Object.values(otherFields)]
    );
    res.status(201).json({ message: "PO created", data: result[0] });
  } catch (err) {
    console.error("Error adding PO:", err);
    res.status(500).json({ error: err.message });
  }
};

// View PO by month ID
exports.viewPOByMonthById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`SELECT * FROM po WHERE id = ?`, [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: "PO not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Error fetching PO by ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update PO by month
exports.updatePOByMonth = async (req, res) => {
  // Similar to update logic in previous code.
};

// Delete PO by month
exports.deletePOByMonth = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`DELETE FROM po WHERE id = ?`, [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "PO not found" });
    }
    res.json({ message: "PO deleted" });
  } catch (err) {
    console.error("Error deleting PO:", err);
    res.status(500).json({ error: err.message });
  }
};
