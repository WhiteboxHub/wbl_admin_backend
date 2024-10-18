const express = require('express');
const router = express.Router();
const accessController = require('../controllers/accessController'); // Adjust the path to usersController
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');

// Route to get users with pagination and search
router.get('/users', AdminValidationMiddleware, (req, res) => {
  const db = req.db;
  console.log(db);
  
  if (!db) {  
    return res.status(500).json({ message: 'Database connection error' });
  }
  const page = parseInt(req.query.page, 10) || 1; // Page number
  const pageSize = parseInt(req.query.pageSize, 10) || 100; // Number of items per page
  const searchQuery = req.query.search || ''; // Search query
  const offset = (page - 1) * pageSize;

  let query = 'SELECT * FROM authuser ORDER BY id DESC';
  let countQuery = 'SELECT COUNT(*) AS total FROM authuser';
  const queryParams = [];
  const countParams = [];

  // Add search functionality if a search query is provided
  if (searchQuery) {
    query += ' WHERE uname LIKE ? OR id LIKE ?'; // Adjust fields as necessary
    countQuery += ' WHERE uname LIKE ? OR id LIKE ?';
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

// Route to insert a new user
router.post('/users/search', (req, res) => {
  const newUser = req.body;

  // Insert the new user
  req.db.query('INSERT INTO whiteboxqa.authuser SET ?', newUser, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...newUser });
  });
});

// Route to update an existing user
router.put('/users/update/:id', AdminValidationMiddleware, accessController.updateUser);

// Route to delete a user
router.delete('/users/delete/:id', AdminValidationMiddleware, accessController.deleteUser);

// Route to search users
router.get("/users/search", AdminValidationMiddleware, (req, res) => {
  const searchQuery = req.query.search || ''; // Get search query from params
  const page = parseInt(req.query.page, 10) || 1; // Default page = 1
  const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default pageSize = 10
  const offset = (page - 1) * pageSize; // Calculate offset for pagination

  // Use parameterized queries to prevent SQL injection
  // const getUsersQuery = `
  //   SELECT * FROM authuser
  //   WHERE (' ', uname) LIKE ?
  //   LIMIT ? OFFSET ?;`; // Apply LIMIT and OFFSET for pagination

  // const totalRowsQuery = `
  //   SELECT COUNT(*) as totalRows FROM authuser
  //   WHERE (' ', uname) LIKE ?;`; // Query to get total rows for pagination

  // First, execute the query to get the total number of rows that match the search
const totalRowsQuery = `
SELECT COUNT(*) as totalRows FROM authuser
WHERE CONCAT(' ', uname) LIKE ?;
`;

const getUsersQuery = `
SELECT * FROM authuser
WHERE CONCAT(' ', uname) LIKE ?
LIMIT ? OFFSET ?;
`;
  // Execute the query to get the total number of rows that match the search
  req.db.query(totalRowsQuery, [`%${searchQuery}%`], (err, totalResults) => {
    if (err) {
      console.error('Error executing totalRowsQuery:', err.stack);
      return res.status(500).json({ error: 'An error occurred while fetching total rows.' });
    }

    // Extract totalRows from the query result
    const totalRows = totalResults[0]?.totalRows || 0;

    // Now execute the query to get the users data based on pagination and search
    req.db.query(getUsersQuery, [`%${searchQuery}%`, pageSize, offset], (error, results) => {
      if (error) {
        console.error('Error executing getUsersQuery:', error.stack);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
      }

      // Return the paginated data and totalRows to the frontend
      res.json({
        data: results,
        totalRows,  // Send total rows for pagination purposes
        page, // Optionally return current page number
        pageSize,   // Optionally return page size
      });
    });
  });
});

module.exports = router;
