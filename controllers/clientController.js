const mysql = require("mysql2/promise");
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Get all POs by client
exports.getPOsByClient = async (req, res) => {
    try {
      const { clientId } = req.query;
  
      // Fetch data from the database
      const [results] = await db.query(
        `SELECT
          PKID, POID, No, InvoicedDate, Quantity, Rate, ExpectedDate, Expected,
          startdate, enddate, Status, ReminderType, Received, ReceivedDate,
          ReleasedDate, CheckNo, companyname, vendorfax, vendorphone, vendoremail,
          timesheetemail, hrname, hremail, hrphone, managername, manageremail,
          managerphone, secondaryname, secondaryemail, secondaryphone,
          candidatename, candidatephone, candidateemail, wrkemail, wrkphone,
          recruitername, recruiterphone, recruiteremail, Notes
        FROM po
        WHERE clientid = ?`,
        [clientId]
      );
  
      res.json({ data: results, totalRows: results.length });
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "Database error" });
    }
  };
  
// Add new PO for a client
exports.addPOByClient = async (req, res) => {
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

// View PO by client ID
exports.viewPOByClientId = async (req, res) => {
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

// Update PO for a client
exports.updatePOByClient = async (req, res) => {
  // Similar to update logic in previous code.
};

// Delete PO for a client
exports.deletePOByClient = async (req, res) => {
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
