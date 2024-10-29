const express = require("express");
const router = express.Router();
const marketingCandidatesController = require("../controllers/marketingCandidatesController"); // Adjust the path accordingly
const AdminValidationMiddleware = require("../Middleware/AdminValidationMiddleware");

// Route to get all candidates for dropdown or filtering
router.get("/marketingcandidates/users", AdminValidationMiddleware, (req, res) => {
  const db = req.db;

  if (!db) {
    return res.status(500).json({ message: "Database connection error" });
  }

  // Define the query to fetch candidates (you can modify this as needed)
  const query = `
    SELECT '' as id, '' as name
    UNION
    SELECT DISTINCT mc.id as id, CONCAT(mc.technology, '-', mc.mmid) as name
    FROM marketingcandidates mc
    ORDER BY name;
  `;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing the candidate query:", err);
      return res.status(500).json({ error: "An error occurred while fetching candidates." });
    }

    // Send the results back to the client
    res.json(results);
  });
});

// Route to get all marketing candidates entries with pagination and search
router.get("/marketingcandidates", AdminValidationMiddleware, (req, res) => {
  const db = req.db;
  if (!db) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const page = parseInt(req.query.page, 10) || 1; // Page number
  const pageSize = parseInt(req.query.pageSize, 10) || 100; // Number of items per page
  const searchQuery = req.query.search || ""; // Search query
  const offset = (page - 1) * pageSize;

  let query = `SELECT * FROM candidatemarketing ORDER BY startdate DESC `;
  let countQuery = 'SELECT COUNT(*) AS total FROM candidatemarketing';
  const queryParams = [];
  const countParams = [];

  // Add search functionality if a search query is provided
  if (searchQuery) {
    query += " WHERE technology LIKE ? OR status LIKE ?"; // Adjust fields as necessary
    countQuery += " WHERE technology LIKE ? OR status LIKE ?";
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

// Route to insert a new marketing candidate entry
router.post("/marketingcandidates/insert", AdminValidationMiddleware, marketingCandidatesController.insertMarketingCandidate);

// Route to update an existing marketing candidate entry
router.put(
  "/marketingcandidates/update/:id",
  AdminValidationMiddleware,
  marketingCandidatesController.updateMarketingCandidate
);

// Route to delete a marketing candidate entry
router.delete(
  "/marketingcandidates/delete/:id",
  AdminValidationMiddleware,
  marketingCandidatesController.deleteMarketingCandidate
);

// Modified backend route to handle global search with pagination for marketing candidates
router.get("/marketingcandidates/search", AdminValidationMiddleware, (req, res) => {
  const db = req.db;
  const searchQuery = req.query.search || ""; // Get search query from params
  const page = parseInt(req.query.page, 10) || 1; // Default page = 1
  const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default pageSize = 10
  const offset = (page - 1) * pageSize; // Calculate offset for pagination

  // Use parameterized queries to prevent SQL injection
  const getCandidatesQuery = `
 SELECT cm.id, cm.startdate, c.name, c.email, c.phone, cm.mmid, cm.instructorid, cm.submitterid,
       c.secondaryemail, c.secondaryphone, c.workstatus, cm.status, cm.priority,
       cm.yearsofexperience, cm.technology, cm.resumeid, cm.minrate, cm.ipemailid, 
       cm.currentlocation, cm.locationpreference, cm.relocation, cm.skypeid, 
       (SELECT link FROM resume WHERE id = cm.resumeid) AS resumelink, 
       (SELECT phone FROM ipemail WHERE id = ipemailid) AS ipphone, 
       cm.closedate, cm.suspensionreason, cm.intro, cm.notes 
FROM candidatemarketing cm, candidate c 
WHERE cm.candidateid = c.candidateid order by startdate desc  `;
 // Apply LIMIT and OFFSET for pagination

  const totalRowsQuery = `
    SELECT COUNT(*) as totalRows FROM candidatemarketing
    WHERE CONCAT_WS(' ', status, technology) LIKE ?;`; // Query to get total rows for pagination

  // Execute the query to get the total number of rows that match the search
  db.query(totalRowsQuery, [`%${searchQuery}%`], (err, totalResults) => {
    if (err) {
      console.error("Error executing totalRowsQuery:", err.stack);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data." });
    }

    const totalRows = totalResults[0].totalRows;

    // Execute the query to get the marketing candidates data based on pagination and search
    db.query(
      getCandidatesQuery,
      [`%${searchQuery}%`, pageSize, offset],
      (error, results) => {
        if (error) {
          console.error("Error executing getCandidatesQuery:", error.stack);
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
