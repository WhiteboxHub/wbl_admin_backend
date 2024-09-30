const mysql = require('mysql2');

// Connect to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Get all candidates
const getCandidates = (req, res) => {
  db.query('SELECT * FROM candidate', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

// Insert a new candidate
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

// Update a candidate
const updateCandidate = (req, res) => {
  const candidateId = req.params.id;
  const updatedCandidate = req.body;

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

module.exports = { getCandidates, insertCandidate, updateCandidate };
