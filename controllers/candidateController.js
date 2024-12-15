const mysql = require('mysql2');
const pool = require('../db')
// // Connect to the database
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
      workpermit, wpexpirationdate, offerletterurl, ssnvalidated, address, a
      city, state, country, zip, emergcontactname, emergcontactemail, 
      emergcontactphone, emergcontactaddrs, guidelines, term, referralid, 
      salary0, salary6, salary12, originalresume, notes 
    FROM candidate ORDER BY candidateid DESC
  `;
  pool.query(query, (err, results) => {
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
  pool.query('INSERT INTO candidate SET ?', newCandidate, (err, results) => {
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
  console.log('Update data:', updatedCandidate);

  // Ensure candidateId and updatedCandidate are present
  if (!candidateId || !updatedCandidate) {
    return res.status(400).json({ message: 'Candidate ID and data are required' });
  }

  // Update the candidate
  pool.query('UPDATE candidate SET ? WHERE candidateid = ?', [updatedCandidate, candidateId], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Check if the status field has been changed to "placed"
    if (updatedCandidate.status && updatedCandidate.status.toLowerCase() === 'placed') {
      const placementData = {
        candidateid: candidateId,
        placementDate: new Date(), // or use a specific date if needed
        // Add any other relevant fields for the placement table
      };

      // Insert into the placement table
      db.query('INSERT INTO placement SET ?', placementData, (placementErr, placementResults) => {
        if (placementErr) {
          console.error('Error inserting into placement table:', placementErr);
          return res.status(500).json({ message: 'Error inserting into placement table' });
        }

        // Respond with success for both updates
        return res.status(200).json({ 
          candidateid: candidateId, 
          ...updatedCandidate,
          placement: placementResults.insertId // return placement details if needed
        });
      });
    } else {
      // If status is not "placed", just return the candidate update response
      res.status(200).json({ candidateid: candidateId, ...updatedCandidate });
    }
  });
};
// // Update a candidate
// -----------------**************************-------------------
// // Delete a batch
// const deleteCandidate = (req, res) => {
//   const batchId = req.params.name;

//   // Ensure batchId is provided
//   if (!batchId) {
//       return res.status(400).json({ message: 'Candidate ID is required' });
//   }

//   // Perform the delete operation
//   pool.query('DELETE FROM candidate WHERE name = ?', [batchId], (err, results) => {
//       if (err) {
//           console.error('Database delete error:', err);
//           return res.status(500).json({ message: 'Database error' });
//       }

//       // Check if any row was affected
//       if (results.affectedRows === 0) {
//           return res.status(404).json({ message: 'Candidate not found' });
//       }

//       // Respond with a success message
//       res.status(200).json({ message: 'candidate deleted successfully' });
//   });
// };


const deleteCandidate = async (req, res) => {
  const candidateId = req.params.id;

  if (!candidateId) {
    return res.status(400).json({ message: 'Candidate ID is required' });
  }

  try {
    // Assuming `db` is a promise-based MySQL connection
    if (!db) {
      return res.status(500).json({ message: 'Database connection is missing' });
    }

    // Check for related records in the candidatemarketing table
    const marketingResults = await db.promise().query('SELECT * FROM candidatemarketing WHERE candidateid = ?', [candidateId]);
    console.log('Marketing Results:', marketingResults); // Debugging step
    if (marketingResults && marketingResults[0] && marketingResults[0].length > 0) {
      // Delete related records in the candidatemarketing table
      await db.promise().query('DELETE FROM candidatemarketing WHERE candidateid = ?', [candidateId]);
    }

    // Delete the candidate record
    const candidateResults = await db.promise().query('DELETE FROM candidate WHERE candidateid = ?', [candidateId]);
    console.log('Candidate Results:', candidateResults); // Debugging step

    if (candidateResults.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
   }
   

    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    console.error('Database delete error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

module.exports = { deleteCandidate };







module.exports = { getCandidates, insertCandidate, deleteCandidate , updateCandidate};