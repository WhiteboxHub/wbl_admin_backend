const db = require('../db');
// Get all POs by purchase order
exports.getPOsByPO = async (req, res) => {
  try {
    const { poId } = req.query;
    const [results] = await db.query(
      `SELECT * FROM po WHERE id = ?`, [poId]
    );
    res.json({ data: results, totalRows: results.length });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// Add new PO by PO number
exports.addPOByPO = async (req, res) => {
  // Similar to previous addPO logic.
};

// View PO by PO number
exports.viewPOByPOId = async (req, res) => {
  // Similar to previous viewPO logic.
};

// Update PO by PO number
exports.updatePOByPO = async (req, res) => {
  // Similar to update logic.
};

// Delete PO by PO number
exports.deletePOByPO = async (req, res) => {
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
