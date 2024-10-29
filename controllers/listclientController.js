// const Client = require('../models/Client'); // Assuming you have a Client model

exports.getAllClients = async (req, res) => {
  const db = req.db; // Access the database connection from the request
  if (!db) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const query = `
 SELECT 
    id, 
    name, 
    email, 
    phone, 
    designation, 
    clientid, 
    (SELECT IFNULL(companyname, " ") FROM client WHERE id = clientid) AS comp, 
    status, 
    dob, 
    personalemail, 
    skypeid, 
    linkedin, 
    twitter, 
    facebook, 
    review, 
    notes 
FROM 
    recruiter 
WHERE 
    vendorid = 0
`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ data: results });
  });
};

exports.addClient = async (req, res) => {
  const db = req.db;
  if (!db) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const {
    name,
    email,
    phone,
    designation,
    vendorid,
    status,
    dob,
    personalemail,
    skypeid,
    linkedin,
    twitter,
    facebook,
    review,
    notes
  } = req.body;

  const query = `
    INSERT INTO client (
      name,
      email,
      phone,
      designation,
      vendorid,
      status,
      dob,
      personalemail,
      skypeid,
      linkedin,
      twitter,
      facebook,
      review,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    email,
    phone,
    designation,
    vendorid,
    status,
    dob,
    personalemail,
    skypeid,
    linkedin,
    twitter,
    facebook,
    review,
    notes
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({ message: "Client added successfully", id: result.insertId });
  });
};

exports.updateClient = async (req, res) => {
  const db = req.db;
  if (!db) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const {
    name,
    email,
    phone,
    designation,
    vendorid,
    status,
    dob,
    personalemail,
    skypeid,
    linkedin,
    twitter,
    facebook,
    review,
    notes
  } = req.body;

  const query = `
    UPDATE client SET
      name = ?,
      email = ?,
      phone = ?,
      designation = ?,
      vendorid = ?,
      status = ?,
      dob = ?,
      personalemail = ?,
      skypeid = ?,
      linkedin = ?,
      twitter = ?,
      facebook = ?,
      review = ?,
      notes = ?
    WHERE id = ?
  `;

  const values = [
    name,
    email,
    phone,
    designation,
    vendorid,
    status,
    dob,
    personalemail,
    skypeid,
    linkedin,
    twitter,
    facebook,
    review,
    notes,
    req.params.id
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client updated successfully" });
  });
};

exports.viewClientById = async (req, res) => {
  const db = req.db;
  if (!db) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const query = `
    SELECT * FROM client WHERE id = ?
  `;

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(results[0]);
  });
};

exports.deleteClient = async (req, res) => {
  const db = req.db;
  if (!db) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const query = `
    DELETE FROM client WHERE id = ?
  `;

  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client deleted successfully" });
  });
};
