

const mysql = require("mysql2/promise"); // Use promise-based mysql2

// Connect to the database
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

exports.getPOs = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT
        po.id AS POID,
        CONCAT(c.name, '---', v.companyname, '---', cl.companyname) AS PlacementDetails,
        po.begindate AS StartDate,
        po.enddate AS EndDate,
        po.rate AS Rate,
        po.overtimerate AS OvertimeRate,
        po.freqtype AS FreqType,
        po.frequency AS InvoiceFrequency,
        po.invoicestartdate AS InvoiceStartDate,
        po.invoicenet AS InvoiceNet,
        po.polink AS POUrl,
        po.notes AS Notes
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
        po.id DESC;
    `); // Using async/await

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
    const updateFields = {};

    // Extract fields from request body and add them to updateFields object
    if (req.body.begindate !== undefined) updateFields.begindate = req.body.begindate;
    if (req.body.enddate !== undefined) updateFields.enddate = req.body.enddate;
    if (req.body.rate !== undefined) updateFields.rate = req.body.rate;
    if (req.body.overtimerate !== undefined) updateFields.overtimerate = req.body.overtimerate;
    if (req.body.freqtype !== undefined) updateFields.freqtype = req.body.freqtype;
    if (req.body.frequency !== undefined) updateFields.frequency = req.body.frequency;
    if (req.body.invoicestartdate !== undefined) updateFields.invoicestartdate = req.body.invoicestartdate;
    if (req.body.invoicenet !== undefined) updateFields.invoicenet = req.body.invoicenet;
    if (req.body.polink !== undefined) updateFields.polink = req.body.polink;
    if (req.body.notes !== undefined) updateFields.notes = req.body.notes;

    // Create an array of field names and values for the SQL query
    const fieldNames = Object.keys(updateFields);
    const fieldValues = Object.values(updateFields);

    // Generate the SET clause for the SQL query
    const setClause = fieldNames.map(field => `${field} = ?`).join(", ");

    // Add the id to the end of fieldValues array for the WHERE clause
    fieldValues.push(id);

    const result = await db.query(
      `UPDATE po SET ${setClause} WHERE id = ?`,
      fieldValues
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "PO not found" });
    }

    res.json({
      message: "PO updated",
      data: updateFields,
    });
  } catch (error) {
    console.error("Error updating PO:", error);
    res.status(500).json({ error: error.message });
  }
};
