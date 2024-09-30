const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');

// Route to get candidates with pagination and search
router.get('/candidates', AdminValidationMiddleware, (req, res) => {
  const db = req.db;
  if (!db) {
    return res.status(500).json({ message: 'Database connection error' });
  }

  const page = parseInt(req.query.page, 10) || 1; // Page number
  const pageSize = parseInt(req.query.pageSize, 10) || 100; // Number of items per page
  const searchQuery = req.query.search || ''; // Search query
  const offset = (page - 1) * pageSize;

  let query = 'SELECT * FROM candidate';
  let countQuery = 'SELECT COUNT(*) AS total FROM candidate';
  const queryParams = [];
  const countParams = [];

  // Add search functionality if a search query is provided
  if (searchQuery) {
    query += ' WHERE name LIKE ? OR email LIKE ?'; // Adjust fields as necessary
    countQuery += ' WHERE name LIKE ? OR email LIKE ?';
    queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
    countParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
  }

  query += ' LIMIT ? OFFSET ?';
  queryParams.push(pageSize, offset);

  // Query to fetch data with pagination and optional search
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Query to count total rows (considering search criteria)
    db.query(countQuery, countParams, (countErr, countResults) => {
      if (countErr) {
        console.error('Count query error:', countErr);
        return res.status(500).json({ message: 'Database error' });
      }

      const totalRows = countResults[0].total;
      res.json({ data: results, totalRows });
    });
  });
});

// Route to insert a new candidate
router.post('/candidates/insert', (req, res) => {
  const newCandidate = req.body;

  // Insert the new candidate
  req.db.query('INSERT INTO candidate SET ?', newCandidate, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...newCandidate });
  });
});

// Route to update an existing candidate
router.put('/candidates/update/:id', AdminValidationMiddleware, (req, res) => {
  const candidateId = req.params.id;
  const updatedCandidate = req.body;

  // Update the candidate
  req.db.query('UPDATE candidate SET ? WHERE candidateid = ?', [updatedCandidate, candidateId], (err) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'Candidate updated successfully' });
  });
});

// Route to search candidates by keyword
router.get('/candidates/search/:keyword', AdminValidationMiddleware, (req, res) => {
  const searchKeyWord = req.params.keyword;

  // Use parameterized queries to prevent SQL injection
  const getColumnsQuery = `
    SELECT * FROM candidate
    WHERE CONCAT_WS(' ', name, email, phone) LIKE ?;`;

  // Execute the query
  req.db.query(getColumnsQuery, [`%${searchKeyWord}%`], (error, results) => {
    if (error) {
      console.error('Error executing query:', error.stack);
      return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }

    res.json(results);
  });
});

module.exports = router;
