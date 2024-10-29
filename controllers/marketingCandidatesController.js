const mysql = require('mysql2');
const pool = require('../db');

// Get all candidates from the marketingCandidates table
const getMarketingCandidates = (req, res) => {
  pool.query(`SELECT id, candidateid, startdate, mmid, instructorid, status, submitterid, 
    priority, technology, minrate, currentlocation, relocation, locationpreference, 
    skypeid, ipemailid, resumeid, coverletter, intro, closedate, closedemail, 
    notes, suspensionreason, yearsofexperience 
    FROM marketingCandidates ORDER BY startdate DESC`, 
  (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

// Insert a new candidate into the marketingCandidates table
const insertMarketingCandidate = (req, res) => {
  const newCandidate = req.body;

  // Make sure to sanitize and validate input data as necessary
  pool.query('INSERT INTO marketingCandidates SET ?', newCandidate, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...newCandidate });
  });
};

// Update a candidate in the marketingCandidates table
const updateMarketingCandidate = (req, res) => {
  const candidateId = req.params.id;
  const updatedCandidate = req.body;

  // Ensure candidateId and updatedCandidate are present
  if (!candidateId || !updatedCandidate) {
    return res.status(400).json({ message: 'Candidate ID and data are required' });
  }

  // Update the candidate
  pool.query('UPDATE marketingCandidates SET ? WHERE id = ?', [updatedCandidate, candidateId], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ id: candidateId, ...updatedCandidate });
  });
};

// Delete a candidate from the marketingCandidates table
const deleteMarketingCandidate = (req, res) => {
  const candidateId = req.params.id;

  // Ensure candidateId is provided
  if (!candidateId) {
    return res.status(400).json({ message: 'Candidate ID is required' });
  }

  // Perform the delete operation
  pool.query('DELETE FROM marketingCandidates WHERE id = ?', [candidateId], (err, results) => {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Check if any row was affected
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Candidate deleted successfully' });
  });
};

module.exports = { getMarketingCandidates, insertMarketingCandidate, updateMarketingCandidate, deleteMarketingCandidate };
