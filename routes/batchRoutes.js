const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController'); // Adjust the path to batchController
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');

// Route to get batches with pagination and search
router.get('/batches', AdminValidationMiddleware, (req, res) => {
  const db = req.db;
  if (!db) {
    return res.status(500).json({ message: 'Database connection error' });
  }

  const page = parseInt(req.query.page, 10) || 1; // Page number
  const pageSize = parseInt(req.query.pageSize, 10) || 100; // Number of items per page
  const searchQuery = req.query.search || ''; // Search query
  const offset = (page - 1) * pageSize;

  let query = 'SELECT * FROM batch ORDER BY orientationdate DESC'; // Replace 'createdAt' with your actual date column name
  let countQuery = 'SELECT COUNT(*) AS total FROM batch';
  const queryParams = [];
  const countParams = [];

  // Add search functionality if a search query is provided
  if (searchQuery) {
    query += ' WHERE batchname LIKE ? OR courseid LIKE ?'; // Adjust fields as necessary
    countQuery += ' WHERE batchname LIKE ? OR courseid LIKE ?';
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

router.get('/batches', AdminValidationMiddleware, (req, res) => {
    const db = req.db;
    if (!db) {
      return res.status(500).json({ message: 'Database connection error' });
    }
  
    // Query to fetch all batches
    db.query('SELECT * FROM batch', (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      // Return the fetched batches
      res.json({ data: results });
    });
  });
  

// Route to insert a new batch
router.post('/batches/insert', (req, res) => {
  const newBatch = req.body;

  // Insert the new batch
  req.db.query('INSERT INTO batch SET ?', newBatch, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...newBatch });
  });
});

// Route to update an existing batch
router.put('/batches/update/:id', AdminValidationMiddleware, batchController.updateBatch);

// Route to insert a new batch using the batchController
router.put('batches/insert', AdminValidationMiddleware, batchController.insertBatch);

// Route to delete a batch
router.delete('/batches/delete/:id', AdminValidationMiddleware, batchController.deleteBatch);


// Route to search for batches by keyword
router.get("/batches/search/:keyword", AdminValidationMiddleware, (req, res) => {
  const searchKeyWord = req.params.keyword;

  // Use parameterized queries to prevent SQL injection
  
  const getColumnsQuery = 
    `SELECT * FROM batch
    WHERE CONCAT_WS(' ', batchname, courseid) LIKE ?`;

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




//2012-04	N	2012-04-08	QA	2012-04-08	2012-06-15	3	1	3		Testing Fundamentals, Web Concepts, JMeter,  Selenium RC/ webdriver, Load Runner, QC, QTP,SQL	Mobile Testing		27	1