const db = require("../db");

// Get all overdue POs
exports.getOverduePOs = (req, res) => {
  console.log("GET request received to fetch all overdue POs");

  // Query to retrieve all overdue POs with the specified fields
  const query = `
    SELECT
    i.id AS pkid, 
    (SELECT concat(c.name, ' - ', v.companyname, ' - ', cl.companyname)
     FROM candidate c
     JOIN placement p ON c.candidateid = p.candidateid
     JOIN po o ON o.placementid = p.id
     JOIN vendor v ON p.vendorid = v.id
     JOIN client cl ON p.clientid = cl.id
     WHERE o.id = i.poid) AS poid,
    i.invoicenumber,
    i.invoicedate,
    i.quantity,
    p.rate,
    DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) AS expecteddate,
    ((i.quantity * p.rate) + (i.otquantity * p.overtimerate)) AS amountexpected,
    i.startdate,
    i.enddate,
    i.status,
    i.remindertype,
    i.amountreceived,
    i.receiveddate,
    i.releaseddate,
    i.checknumber,
    i.invoiceurl,
    i.checkurl,
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
    i.status NOT IN ('Void', 'Closed') AND
    DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) <= CURDATE()
ORDER BY
    pkid DESC
    `;

  // Additional query to get the total count of overdue POs
  const countQuery = `
    SELECT COUNT(*) AS totalRows
    FROM
        invoice i
    JOIN
        po p ON i.poid = p.id
    WHERE
        i.status NOT IN ('Void', 'Closed') AND
        DATE_ADD(i.invoicedate, INTERVAL p.invoicenet DAY) <= CURDATE()
    `;

  // Execute both queries
  db.query(countQuery, (countErr, countResult) => {
    if (countErr) {
      console.error("Database query error:", countErr);
      return res
        .status(500)
        .json({ message: "Database error", error: countErr.message });
    }

    const totalRows = countResult[0].totalRows;

    // Now fetch the data query
    db.query(query, (dataErr, dataResults) => {
      if (dataErr) {
        console.error("Database query error:", dataErr);
        return res
          .status(500)
          .json({ message: "Database error", error: dataErr.message });
      }

      console.log("Query results:", dataResults);

      // Return results in the format expected by the frontend
      return res.status(200).json({ data: dataResults, totalRows });
    });
  });
};

// Add new overdue PO
exports.addOverduePO = async (req, res) => {
  // Similar to previous addPO logic.
};

// View overdue PO by ID
exports.viewOverduePOById = async (req, res) => {
  // Similar to viewPO logic.
};

// Update overdue PO
exports.updateOverduePO = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    // Construct a query string dynamically based on the provided updates
    const updateFields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
  
    const query = `UPDATE po SET ${updateFields} WHERE id = ?`;
    const values = [...Object.values(updates), id];
  
    try {
      const result = await db.query(query, values);
  
      if (result[0].affectedRows === 0) {
        return res.status(404).json({ error: "PO not found" });
      }
  
      res.json({ message: "PO updated successfully" });
    } catch (err) {
      console.error("Error updating PO:", err);
      res.status(500).json({ error: err.message });
    }
  };
  
  // Delete overdue PO
  exports.deleteOverduePO = async (req, res) => {
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
