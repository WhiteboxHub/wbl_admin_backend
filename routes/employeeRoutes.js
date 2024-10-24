const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController"); // Adjust the path to employeeController
const AdminValidationMiddleware = require("../Middleware/AdminValidationMiddleware");

// Route to get employees with pagination and search
router.get("/employees", AdminValidationMiddleware, (req, res) => {
  const db = req.db;
  if (!db) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const page = parseInt(req.query.page, 10) || 1; // Page number
  const pageSize = parseInt(req.query.pageSize, 10) || 100; // Number of items per page
  const searchQuery = req.query.search || ""; // Search query
  const offset = (page - 1) * pageSize;

  let query = 'SELECT * FROM employee ';
  let countQuery = 'SELECT COUNT(*) AS total FROM employee';
  const queryParams = [];
  const countParams = [];

  // Add search functionality if a search query is provided
  if (searchQuery) {
    query += " WHERE name LIKE ? OR id LIKE ?"; // Adjust fields as necessary
    countQuery += " WHERE name LIKE ? OR id LIKE ?";
    queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
    countParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
  }

  query += " LIMIT ? OFFSET ?";
  queryParams.push(pageSize, offset);

  // Query to fetch data with pagination and optional search
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Query to count total rows (considering search criteria)
    db.query(countQuery, countParams, (countErr, countResults) => {
      if (countErr) {
        console.error("Count query error:", countErr);
        return res.status(500).json({ message: "Database error" });
      }

      const totalRows = countResults[0].total;
      res.json({ data: results, totalRows });
    });
  });
});

// Route to insert a new employee
router.post("/employees/insert", (req, res) => {
  const newEmployee = req.body;
  const authtoken = req.header("authToken");

  // Insert the new employee
  req.db.query("INSERT INTO employee SET ?", newEmployee, (err, results) => {
    if (err) {
      console.error("Database insert error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ id: results.insertId, ...newEmployee });
  });
});

// Route to update an existing employee
router.put(
  "/employees/update/:id",
  AdminValidationMiddleware,
  employeeController.updateEmployee
);

// Route to delete an employee
router.delete(
  "/employees/delete/:id",
  AdminValidationMiddleware,
  employeeController.deleteEmployee
);

// Modified backend route to handle global search with pagination
router.get("/employees/search", AdminValidationMiddleware, (req, res) => {
  const searchQuery = req.query.search || ""; // Get search query from params
  const page = parseInt(req.query.page, 10) || 1; // Default page = 1
  const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default pageSize = 10
  const offset = (page - 1) * pageSize; // Calculate offset for pagination

  // Use parameterized queries to prevent SQL injection
  const getEmployeesQuery = `
SELECT * FROM employee
WHERE CONCAT_WS(' ', name, email, phone) LIKE ?
ORDER BY id DESC
LIMIT ? OFFSET ?;
`; 
 // Apply LIMIT and OFFSET for pagination

  const totalRowsQuery = `
    SELECT COUNT(*) as totalRows FROM employee
    WHERE CONCAT_WS(' ', name, email, phone) LIKE ?;`; // Query to get total rows for pagination

  // Execute the query to get the total number of rows that match the search
  req.db.query(totalRowsQuery, [`%${searchQuery}%`], (err, totalResults) => {
    if (err) {
      console.error("Error executing totalRowsQuery:", err.stack);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data." });
    }

    const totalRows = totalResults[0].totalRows;

    // Execute the query to get the employees data based on pagination and search
    req.db.query(
      getEmployeesQuery,
      [`%${searchQuery}%`, pageSize, offset],
      (error, results) => {
        if (error) {
          console.error("Error executing getEmployeesQuery:", error.stack);
          return res
            .status(500)
            .json({ error: "An error occurred while fetching data." });
        }

        // Return the data and totalRows to the frontend
        res.json({
          data: results,
          totalRows, // Send total rows for pagination purposes
        });
      }
    );
  });
});

module.exports = router;
