const mysql = require("mysql2/promise");
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Get all POs by vendor
exports.getPOsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.query;
    const [results] = await db.query(
      `SELECT * FROM po WHERE vendorid = ?`, [vendorId]
    );
    res.json({ data: results, totalRows: results.length });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// Add new PO for vendor
exports.addPOByVendor = async (req, res) => {
  // Similar to previous addPO logic.
};

// View PO by vendor ID
exports.viewPOByVendorId = async (req, res) => {
  // Similar to viewPO logic.
};

// Update PO by vendor
exports.updatePOByVendor = async (req, res) => {
  // Similar to update logic.
};

// Delete PO by vendor
exports.deletePOByVendor = async (req, res) => {
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
