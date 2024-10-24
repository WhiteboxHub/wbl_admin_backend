const mysql = require('mysql2');

// Connect to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});


const getCandidates = (req, res) => {
  const query = `
    SELECT 
      name, email, phone, course, batchname, enrolleddate, status, diceflag, 
      education, workstatus, dob, portalid, agreement, driverslicense, 
      workpermit, wpexpirationdate, offerletterurl, ssnvalidated, address, 
      city, state, country, zip, emergcontactname, emergcontactemail, 
      emergcontactphone, emergcontactaddrs, guidelines, term, referralid, 
      salary0, salary6, salary12, originalresume, notes 
    FROM candidate ORDER BY candidateid DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};


const insertCandidate = (req, res) => {
  const newCandidate = req.body;

  // Make sure to sanitize and validate input data as necessary
  db.query('INSERT INTO candidate SET ?', newCandidate, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...newCandidate });
  });
};
// // -----------------------------------**********************------------------
// Update a candidate
const updateCandidate = (req, res) => {
  const candidateId = req.params.id;
  const updatedCandidate = req.body;
  console.log('PUT request received for ID:', candidateId);
  // Ensure candidateId and updatedCandidate are present
  if (!candidateId || !updatedCandidate) {
    return res.status(400).json({ message: 'Candidate ID and data are required' });
  }

  // Update the candidate
  db.query('UPDATE candidate SET ? WHERE candidateid = ?', [updatedCandidate, candidateId], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ candidateid: candidateId, ...updatedCandidate });
  });
};
// // Update a candidate
// -----------------**************************-------------------
// Delete a batch
const deleteCandidate = (req, res) => {
  const batchId = req.params.name;

  // Ensure batchId is provided
  if (!batchId) {
      return res.status(400).json({ message: 'Candidate ID is required' });
  }

  // Perform the delete operation
  db.query('DELETE FROM candidate WHERE name = ?', [batchId], (err, results) => {
      if (err) {
          console.error('Database delete error:', err);
          return res.status(500).json({ message: 'Database error' });
      }

      // Check if any row was affected
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Candidate not found' });
      }

      // Respond with a success message
      res.status(200).json({ message: 'candidate deleted successfully' });
  });
};




module.exports = { getCandidates, insertCandidate, deleteCandidate , updateCandidate};