const db = require('../db');

exports.getPOsByMonth = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
    const pageSize = parseInt(req.query.pageSize) || 100; // Get the page size from query params, default to 100
    const offset = (page - 1) * pageSize; // Calculate the offset for pagination

    // Fetch the POs data
    const results = await db.query(`
      SELECT
        i.id,
        i.poid,
        i.invoicenumber,
        i.startdate,
        i.enddate,
        i.invoicedate,
        DATE_FORMAT(i.invoicedate, "%Y-%c-%M") AS invmonth,
        i.quantity,
        i.otquantity,
        p.rate,
        p.overtimerate,
        i.status,
        i.emppaiddate,
        i.candpaymentstatus,
        i.reminders,
        ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
        DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
        i.amountreceived,
        i.receiveddate,
        i.releaseddate,
        i.checknumber,
        i.invoiceurl,
        i.checkurl,
        p.freqtype,
        p.invoicenet,
        v.companyname,
        v.fax AS vendorfax,
        v.phone AS vendorphone,
        v.email AS vendoremail,
        v.timsheetemail,
        v.hrname,
        v.hremail,
        v.hrphone,
        v.managername,
        v.manageremail,
        v.managerphone,
        v.secondaryname,
        v.secondaryemail,
        v.secondaryphone,
        c.name AS candidatename,
        c.phone AS candidatephone,
        c.email AS candidateemail,
        pl.wrkemail,
        pl.wrkphone,
        r.name AS recruitername,
        r.phone AS recruiterphone,
        r.email AS recruiteremail,
        i.notes
      FROM
        invoice i
      JOIN
        po p ON i.poid = p.id
      JOIN
        placement pl ON p.placementid = pl.id
      JOIN
        candidate c ON pl.candidateid = c.candidateid
      JOIN
        vendor v ON pl.vendorid = v.id
      JOIN
        recruiter r ON pl.recruiterid = r.id
      WHERE
        i.status <> "Delete"
      `, [pageSize, offset]); // Use LIMIT and OFFSET for pagination

    // Log the results for debugging
    console.log("Query results:", results);

    // Get the total count of rows for pagination
    const totalCountResult = await db.query(`SELECT COUNT(*) AS total FROM invoice WHERE status <> "Delete";`);

    // Log the total count result for debugging
    console.log("Total count result:", totalCountResult);

    // Ensure totalCountResult is valid before accessing total
    if (!totalCountResult || totalCountResult.length === 0 || !totalCountResult[0].total) {
      return res.status(500).json({ message: "Unable to fetch total row count" });
    }

    const totalRows = totalCountResult[0].total;

    // Respond with the results and total row count for pagination
    res.json({
      data: results,
      totalRows: totalRows, // Total count of rows in the database
      totalPages: Math.ceil(totalRows / pageSize), // Total number of pages
      currentPage: page, // Current page number
      pageSize: pageSize, // Page size
    });
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
      `INSERT INTO po (placementid, begindate, enddate, rate, ${Object.keys(otherFields).join(', ')}) VALUES (?, ?, ?, ?, ${Object.values(otherFields).map(() => '?').join(', ')})`,
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
  try {
    const { id } = req.params;
    const { placementid, begindate, enddate, rate, ...otherFields } = req.body;
    const result = await db.query(
      `UPDATE po SET placementid = ?, begindate = ?, enddate = ?, rate = ?, ${Object.keys(otherFields).map(key => `${key} = ?`).join(', ')} WHERE id = ?`,
      [...Object.values(otherFields), id]
    );
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "PO not found" });
    }
    res.json({ message: "PO updated" });
  } catch (err) {
    console.error("Error updating PO:", err);
    res.status(500).json({ error: err.message });
  }
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
