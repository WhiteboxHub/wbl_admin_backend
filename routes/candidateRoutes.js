const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController'); // Adjust the path to candidateController
const AdminValidationMiddleware = require('../middleware/AdminValidationMiddleware');

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

  // let query = '
  // SELECT * FROM candidate ORDER BY batchname DESC
  // ';
  let query=`
 SELECT 
     candidateid, name, email, phone, course, batchname, enrolleddate, status, diceflag, 
      education, workstatus, dob, portalid, agreement, driverslicense, 
      workpermit, wpexpirationdate, offerletterurl, ssnvalidated, address, 
      city, state, country, zip, emergcontactname, emergcontactemail, 
      emergcontactphone, emergcontactaddrs, guidelines, term, referralid, 
      salary0, salary6, salary12, originalresume, notes 
    FROM candidate ORDER BY candidateid DESC 
  `;
  let countQuery = 'SELECT COUNT(*) AS total FROM candidate';
  const queryParams = [];
  const countParams = [];

  // Add search functionality if a search query is provided
  if (searchQuery) {
    query += ' WHERE name LIKE ? OR id LIKE ?'; // Adjust fields as necessary
    countQuery += ' WHERE name LIKE ? OR id LIKE ?';
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
  const authtoken = req.header('authToken');

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
router.put('/candidates/update/:id', AdminValidationMiddleware, candidateController.updateCandidate);

// Route to insert a new candidate using the candidateController
router.put('/candidates/insert', AdminValidationMiddleware, candidateController.insertCandidate);

router.delete('/candidates/delete/:name', AdminValidationMiddleware, candidateController.deleteCandidate);

// Modified backend route to handle global search with pagination
router.get("/candidates/search", AdminValidationMiddleware, (req, res) => {
  const searchQuery = req.query.search || ''; // Get search query from params
  const page = parseInt(req.query.page, 10) || 1; // Default page = 1
  const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default pageSize = 10
  const offset = (page - 1) * pageSize; // Calculate offset for pagination

  // Use parameterized queries to prevent SQL injection
  const getCandidatesQuery = `
    SELECT * FROM whiteboxqa.candidate
    WHERE CONCAT_WS(' ', name) LIKE ?
    LIMIT ? OFFSET ?;`; // Apply LIMIT and OFFSET for pagination

  const totalRowsQuery = `
    SELECT COUNT(*) as totalRows FROM whiteboxqa.candidate
    WHERE CONCAT_WS(' ', name) LIKE ?;`; // Query to get total rows for pagination

  // Execute the query to get the total number of rows that match the search
  req.db.query(totalRowsQuery, [`%${searchQuery}%`], (err, totalResults) => {
    if (err) {
      console.error('Error executing totalRowsQuery:', err.stack);
      return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }

    const totalRows = totalResults[0].totalRows;

    // Execute the query to get the candidates data based on pagination and search
    req.db.query(getCandidatesQuery, [`%${searchQuery}%`, pageSize, offset], (error, results) => {
      if (error) {
        console.error('Error executing getCandidatesQuery:', error.stack);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
      }

      // Return the data and totalRows to the frontend
      res.json({
        data: results,
        totalRows,  // Send total rows for pagination purposes
      });
    });
  });
});

module.exports = router;
