

const mysql = require("mysql2/promise"); // Use promise-based mysql2

// Connect to the database
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// exports.getPOs = async (req, res) => {
//   try {
//     const [results] = await db.query(`
//       SELECT
//         po.id AS POID,
//         CONCAT(c.name, '---', v.companyname, '---', cl.companyname) AS PlacementDetails,
//         po.begindate AS StartDate,
//         po.enddate AS EndDate,
//         po.rate AS Rate,
//         po.overtimerate AS OvertimeRate,
//         po.freqtype AS FreqType,
//         po.frequency AS InvoiceFrequency,
//         po.invoicestartdate AS InvoiceStartDate,
//         po.invoicenet AS InvoiceNet,
//         po.polink AS POUrl,
//         po.notes AS Notes
//       FROM
//         po
//       LEFT JOIN
//         placement pl ON po.placementid = pl.id
//       LEFT JOIN
//         candidate c ON pl.candidateid = c.candidateid
//       LEFT JOIN
//         vendor v ON pl.vendorid = v.id
//       LEFT JOIN
//         client cl ON pl.clientid = cl.id
//       ORDER BY
//         po.id DESC;
//     `); // Using async/await

//     res.json({
//       data: results,
//       totalRows: results.length, // Total count of rows returned
//     });
//   } catch (err) {
//     console.error("Database query error:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };


// Middleware to attach the database connection to the request object


// Add new PO

exports.getPOs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the current page from query params
    const pageSize = parseInt(req.query.pageSize) || 100; // Get the page size from query params
    const offset = (page - 1) * pageSize; // Calculate the offset for pagination

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
        po.id DESC
      LIMIT ? OFFSET ?;`, [pageSize, offset]); // Use LIMIT and OFFSET for pagination

    // Get total count of rows for pagination
    const [totalCountResult] = await db.query(`SELECT COUNT(*) AS total FROM po;`);
    const totalRows = totalCountResult[0].total;

    res.json({
      data: results,
      totalRows: totalRows, // Total count of rows in the database
    });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

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

    const result = await req.db.query(
      `INSERT INTO po (placementid, begindate, enddate, rate, overtimerate, freqtype, frequency, invoicestartdate, invoicenet, polink, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    res.status(201).json({ message: "PO created", data: result[0] });
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

    if (req.body.placementid !== undefined) updateFields.placementid = req.body.placementid;
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

    const fieldNames = Object.keys(updateFields);
    const fieldValues = Object.values(updateFields);

    const setClause = fieldNames.map(field => `${field} = ?`).join(", ");

    fieldValues.push(id);

    const result = await req.db.query(
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

// View PO
exports.viewPO = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await req.db.query(
      `SELECT id, placementid, begindate, enddate, rate, overtimerate, freqtype, frequency, invoicestartdate, invoicenet, polink, notes
       FROM po
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "PO not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error viewing PO:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete PO
exports.deletePO = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await req.db.query(
      `DELETE FROM po WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "PO not found" });
    }

    res.json({ message: "PO deleted" });
  } catch (error) {
    console.error("Error deleting PO:", error);
    res.status(500).json({ error: error.message });
  }
};


// Search PO
exports.searchPO = async (req, res) => {
  try {
    const { searchField, searchValue } = req.query;

    if (!searchField || !searchValue) {
      return res.status(400).json({ error: "Search field and value are required" });
    }

    const [rows] = await req.db.query(
      `SELECT id, placementid, begindate, enddate, rate, overtimerate, freqtype, frequency, invoicestartdate, invoicenet, polink, notes
       FROM po
       WHERE ${searchField} LIKE ?`,
      [`%${searchValue}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error searching PO:", error);
    res.status(500).json({ error: error.message });
  }
};