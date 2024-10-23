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

  let query = 'SELECT * FROM batch ORDER BY batchid DESC'; // Replace 'createdAt' with your actual date column name
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




router.get("/batches/search", AdminValidationMiddleware, (req, res) => {
  const searchQuery = req.query.search || ''; // Get search query from params
  const page = parseInt(req.query.page, 10) || 1; // Default page = 1
  const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default pageSize = 10
  const offset = (page - 1) * pageSize; // Calculate offset for pagination

  // Use parameterized queries to prevent SQL injection
  const getbatchQuery = `
    SELECT * FROM whiteboxqa.batch
    WHERE CONCAT_WS(' ', batchname) LIKE ? 
    LIMIT ? OFFSET ?;`; // Apply LIMIT and OFFSET for pagination

  const totalRowsQuery = `
    SELECT COUNT(*) as totalRows FROM whiteboxqa.batch
    WHERE CONCAT_WS(' ', batchname) LIKE ?;`; // Query to get total rows for pagination

  // Execute the query to get the total number of rows that match the search
  req.db.query(totalRowsQuery, [`%${searchQuery}%`], (err, totalResults) => {
    if (err) {
      console.error('Error executing totalRowsQuery:', err.stack);
      return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }

    const totalRows = totalResults[0].totalRows;

    // Execute the query to get the batch data based on pagination and search
    req.db.query(getbatchQuery, [`%${searchQuery}%`, pageSize, offset], (error, results) => {
      if (error) {
        console.error('Error executing getbatchQuery:', error.stack);
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




//2012-04	N	2012-04-08	QA	2012-04-08	2012-06-15	3	1	3		Testing Fundamentals, Web Concepts, JMeter,  Selenium RC/ webdriver, Load Runner, QC, QTP,SQL	Mobile Testing		27	1