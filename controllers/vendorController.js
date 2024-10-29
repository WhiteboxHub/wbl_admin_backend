// const pool = require("../db");
exports.getPOsByVendor = async (req, res) => {
  const db = req.db; // Access the database connection from the request
  if (!db) {
    return res.status(500).json({ message: "Database connection error" });
  }

  // Query to fetch all vendors with the same columns as in the PHP script
  const query = `
    SELECT
      id,
      companyname,
      status,
      tier,
      culture,
      solicited,
      minrate,
      hirebeforeterm,
      hireafterterm,
      latepayments,
      totalnetterm,
      defaultedpayment,
      agreementstatus,
      url,
      email,
      phone,
      fax,
      address,
      city,
      state,
      country,
      zip,
      hrname,
      hremail,
      hrphone,
      twitter,
      facebook,
      linkedin,
      accountnumber,
      managername,
      manageremail,
      managerphone,
      secondaryname,
      secondaryemail,
      secondaryphone,
      timsheetemail,
      agreementname,
      agreementlink,
      subcontractorlink,
      nonsolicitationlink,
      nonhirelink,
      clients,
      notes
    FROM vendor
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Return the fetched vendors
    res.json({ data: results });
  });
};


// // Update PO by vendor (placeholder function)
// exports.updatePOByVendor = async (req, res) => {
//   // Similar to update logic.
// };

// // Delete PO by vendor (placeholder function)
// exports.deletePOByVendor = async (req, res) => {
//   // Similar to delete logic.
// };
