

const mysql = require("mysql2/promise"); // Use promise-based mysql2

// Connect to the database
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Get all POs
// Get all POs
exports.getPOs = async (req, res) => {
  try {
    const [results] = await db.query(`SELECT 
        po.id AS "PO ID",
        pl.id AS "Placement ID",
        po.begindate AS "Start Date",
        po.enddate AS "End Date",
        po.rate AS "Rate",
        po.overtimerate AS "Overtime Rate",
        po.freqtype AS "Freq. Type",
        po.frequency AS "Invoice Frequency",
        po.invoicestartdate AS "Invoice Start Date",
        po.invoicenet AS "Invoice Net",
        po.polink AS "PO Url",
        po.notes AS "Notes",
        CONCAT(c.name, '---', v.companyname, '---', cl.companyname) AS "Placement Details"
      FROM 
        po
      LEFT JOIN 
        placement pl ON po.placementid = pl.id
      LEFT JOIN 
        candidate c ON pl.candidateid = c.candidateid
      LEFT JOIN 
        vendor v ON pl.vendorid = v.id
      LEFT JOIN 
        client cl ON pl.clientid = cl.id
      ORDER BY 
        po.id DESC;  -- Order by PO ID in descending order`); // Using async/await
    res.json({
      data: results,
      totalRows: results.length, // Total count of rows returned
    });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// Fetch PO by ID
exports.getPOById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "PO ID is required" });
    }

    const query = `
      SELECT 
        po.id AS "PO ID", 
        CONCAT(c.name, '---', v.companyname, '---', cl.companyname) AS "Placement Details"
        pl.id AS "Placement ID",
        po.begindate AS "Start Date", 
        po.enddate AS "End Date", 
        po.rate AS "Rate", 
        po.overtimerate AS "Overtime Rate", 
        po.freqtype AS "Freq. Type", 
        po.frequency AS "Invoice Frequency", 
        po.invoicestartdate AS "Invoice Start Date", 
        po.invoicenet AS "Invoice Net", 
        po.polink AS "PO Url", 
        po.notes AS "Notes", 
      FROM 
        po
      LEFT JOIN 
        placement pl ON po.placementid = pl.id
      LEFT JOIN 
        candidate c ON pl.candidateid = c.candidateid
      LEFT JOIN 
        vendor v ON pl.vendorid = v.id
      LEFT JOIN 
        client cl ON pl.clientid = cl.id
      WHERE 
        po.id = ?;  -- Use parameterized query for security
    `;

    const [result] = await db.query(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "PO not found" });
    }

    res.json(result[0]); // Respond with the found purchase order details
  } catch (error) {
    console.error("Error fetching PO by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add new PO
exports.addPO = async (req, res) => {
  try {
    const {
      placementid,
      begindate,
      enddate,
      rate,
      overtimerate,
      freqtype,
      frequency,
      invoicestartdate,
      invoicenet,
      polink,
      notes,
    } = req.body;

    const result = await db.query(
      `INSERT INTO po (placementid, begindate, enddate, rate, overtimerate, freqtype, frequency, invoicestartdate, invoicenet, polink, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // Use ? placeholders
      [
        placementid,
        begindate,
        enddate,
        rate,
        overtimerate,
        freqtype,
        frequency,
        invoicestartdate,
        invoicenet,
        polink,
        notes,
      ]
    );

    res.status(201).json({ message: "PO created", data: result[0] }); // Respond with success
  } catch (error) {
    console.error("Error adding PO:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update PO
exports.updatePO = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      placementid,
      begindate,
      enddate,
      rate,
      overtimerate,
      freqtype,
      frequency,
      invoicestartdate,
      invoicenet,
      polink,
      notes,
    } = req.body;

    // Validate required fields
    if (!placementid || !id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await db.query(
      `UPDATE po SET
        placementid = ?,
        begindate = ?,
        enddate = ?,
        rate = ?,
        overtimerate = ?,
        freqtype = ?,
        frequency = ?,
        invoicestartdate = ?,
        invoicenet = ?,
        polink = ?,
        notes = ?
      WHERE id = ?`,
      [
        placementid,
        begindate,
        enddate,
        rate,
        overtimerate,
        freqtype,
        frequency,
        invoicestartdate,
        invoicenet,
        polink,
        notes,
        id,
      ]
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "PO not found" });
    }

    res.json({
      message: "PO updated",
      data: {
        id,
        placementid,
        begindate,
        enddate,
        rate,
        overtimerate,
        freqtype,
        frequency,
        invoicestartdate,
        invoicenet,
        polink,
        notes,
      },
    });
  } catch (error) {
    console.error("Error updating PO:", error);
    res.status(500).json({ error: error.message });
  }
};
