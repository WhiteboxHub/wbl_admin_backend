// const express = require('express');
// const router = express.Router();
// const mysql = require('mysql2'); // Use mysql2 instead of mysql

// // Create MySQL connection
// const db = mysql.createConnection({
//   host: '35.232.56.51',
//   user: 'whiteboxqa',
//   password: 'Innovapath1',
//   database: 'whiteboxqa'
// });

// // Middleware to handle database connection
// router.use((req, res, next) => {
//   req.db = db;
//   next();
// });

// // Route to get leads with pagination
// router.get('/leads', (req, res) => {
//   const db = req.db;
//   if (!db) {
//     return res.status(500).json({ message: 'Database connection error' });
//   }

//   const page = parseInt(req.query.page, 10) || 1; // Page number
//   const pageSize = parseInt(req.query.pageSize, 10) || 100; // Number of items per page
//   const offset = (page - 1) * pageSize;

//   // Query to fetch data with pagination
//   db.query(
//     'SELECT * FROM leads LIMIT ? OFFSET ?',
//     [pageSize, offset],
//     (err, results) => {
//       if (err) {
//         console.error('Database query error:', err);
//         return res.status(500).json({ message: 'Database error' });
//       }

//       // Query to count total rows
//       db.query('SELECT COUNT(*) AS total FROM leads', (countErr, countResults) => {
//         if (countErr) {
//           console.error('Count query error:', countErr);
//           return res.status(500).json({ message: 'Database error' });
//         }
//         const totalRows = countResults[0].total;
//         res.json({ data: results, totalRows });
//       });
//     }
//   );
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const mysql = require('mysql2');

// // Create MySQL connection
// const db = mysql.createConnection({
//   host: '35.232.56.51',
//   user: 'whiteboxqa',
//   password: 'Innovapath1',
//   database: 'whiteboxqa'
// });

// // Middleware to handle database connection
// router.use((req, res, next) => {
//   req.db = db;
//   next();
// });

// // Route to get leads with pagination
// router.get('/leads', (req, res) => {
//   const db = req.db;
//   if (!db) {
//     return res.status(500).json({ message: 'Database connection error' });
//   }

//   const page = parseInt(req.query.page, 10) || 1; // Page number
//   const pageSize = parseInt(req.query.pageSize, 10) || 100; // Number of items per page
//   const offset = (page - 1) * pageSize;

//   // Query to fetch data with pagination
//   db.query(
//     'SELECT * FROM leads LIMIT ? OFFSET ?',
//     [pageSize, offset],
//     (err, results) => {
//       if (err) {
//         console.error('Database query error:', err);
//         return res.status(500).json({ message: 'Database error' });
//       }

//       // Query to count total rows
//       db.query('SELECT COUNT(*) AS total FROM leads', (countErr, countResults) => {
//         if (countErr) {
//           console.error('Count query error:', countErr);
//           return res.status(500).json({ message: 'Database error' });
//         }
//         const totalRows = countResults[0].total;
//         res.json({ data: results, totalRows });
//       });
//     }
//   );
// });

// // Route to insert a new lead
// router.post('/leads', (req, res) => {
//   const newLead = req.body;

//   // Insert the new lead
//   db.query('INSERT INTO leads SET ?', newLead, (err, results) => {
//     if (err) {
//       console.error('Database insert error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
//     res.status(201).json({ id: results.insertId, ...newLead });
//   });
// });

// module.exports = router;

// ********************************************************************************************************

// const express = require('express');
// const router = express.Router();
// const leadsController = require('../controllers/leadsController'); // Adjust the path to leadsController
// const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware')
// // Route to get leads with pagination
// router.get('/leads',AdminValidationMiddleware ,(req, res) => {
  
//   const db = req.db;
//   if (!db) {
//     return res.status(500).json({ message: 'Database connection error' });
//   }

//   const page = parseInt(req.query.page, 10) || 1; // Page number
//   const pageSize = parseInt(req.query.pageSize, 10) || 100; // Number of items per page
//   const offset = (page - 1) * pageSize;

//   // Query to fetch data with pagination
//   db.query(
//     'SELECT * FROM leads LIMIT ? OFFSET ?',
//     [pageSize, offset],
//     (err, results) => {
//       if (err) {
//         console.error('Database query error:', err);
//         return res.status(500).json({ message: 'Database error' });
//       }

//       // Query to count total rows
//       db.query('SELECT COUNT(*) AS total FROM leads', (countErr, countResults) => {
//         if (countErr) {
//           console.error('Count query error:', countErr);
//           return res.status(500).json({ message: 'Database error' });
//         }
//         const totalRows = countResults[0].total;
//         res.json({ data: results, totalRows });
//       });
//     }
//   );
// });

// // Route to insert a new lead
// router.post('/leads', (req, res) => {
//   const newLead = req.body;
//   const authtoken = req.header('authToken')
//   // Insert the new lead
//   req.db.query('INSERT INTO leads SET ?', newLead, (err, results) => {
//     if (err) {
//       console.error('Database insert error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
//     res.status(201).json({ id: results.insertId, ...newLead });
//   });
// });

// // Route to update an existing lead
// router.put('/leads/update/:id', AdminValidationMiddleware ,leadsController.updateLead); // Use the controller function
// router.put('/insert/leads', AdminValidationMiddleware ,leadsController.insertLead);
// module.exports = router;

// ********************************************************************************************************


// const express = require('express');
// const router = express.Router();
// const leadsController = require('../controllers/leadsController'); // Adjust the path to leadsController
// const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');

// // Route to get leads with pagination and search
// router.get('/leads', AdminValidationMiddleware, (req, res) => {
//   const db = req.db;
//   if (!db) {
//     return res.status(500).json({ message: 'Database connection error' });
//   }

//   const page = parseInt(req.query.page, 10) || 1; // Page number
//   const pageSize = parseInt(req.query.pageSize, 10) || 100; // Number of items per page
//   const searchQuery = req.query.search || ''; // Search query
//   const offset = (page - 1) * pageSize;

//   let query = 'SELECT * FROM leads';
//   let countQuery = 'SELECT COUNT(*) AS total FROM leads';
//   const queryParams = [];
//   const countParams = [];

//   // Add search functionality if a search query is provided
//   if (searchQuery) {
//     query += ' WHERE name LIKE ? OR id LIKE ?'; // Adjust fields as necessary
//     countQuery += ' WHERE name LIKE ? OR id LIKE ?';
//     queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
//     countParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
//   }

//   query += ' LIMIT ? OFFSET ?';
//   queryParams.push(pageSize, offset);

//   // Query to fetch data with pagination and optional search
//   db.query(query, queryParams, (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     // Query to count total rows (considering search criteria)
//     db.query(countQuery, countParams, (countErr, countResults) => {
//       if (countErr) {
//         console.error('Count query error:', countErr);
//         return res.status(500).json({ message: 'Database error' });
//       }

//       const totalRows = countResults[0].total;
//       res.json({ data: results, totalRows });
//     });
//   });
// });

// // Route to insert a new lead
// router.post('/leads', (req, res) => {
//   const newLead = req.body;
//   const authtoken = req.header('authToken');

//   // Insert the new lead
//   req.db.query('INSERT INTO leads SET ?', newLead, (err, results) => {
//     if (err) {
//       console.error('Database insert error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
//     res.status(201).json({ id: results.insertId, ...newLead });
//   });
// });

// // Route to update an existing lead
// router.put('/leads/update/:id', AdminValidationMiddleware, leadsController.updateLead);

// // Route to insert a new lead using the leadsController
// router.put('/insert/leads', AdminValidationMiddleware, leadsController.insertLead);
//   router.get("/leads/search/:keyword",AdminValidationMiddleware,(req ,res) =>{
//   const searchKeyWord=req.params.keyword
//   //  Get all text-like columns from the table
//   const getColumnsQuery = `SELECT * FROM whiteboxqa.leads WHERE CONCAT_WS(' ', 
//       name, phone, email, sourcename,course, status, secondaryemail,secondaryphone, address, spousename, spouseemail, spousephone, spouseoccupationinfo,
//       city, state, country
//   ) LIKE '%${searchKeyWord}%';`;
//     // Execute the query
//     req.db.query(getColumnsQuery, (error, results, fields) => {
//       if (error) {
//         console.error('Error executing query:', error.stack);
//         return;
//       }

//     // Output the results
//     console.log('Query results:', results);

//     // Optionally, print field information
//     console.log('Fields:', fields);
//     res.status(201).json({fields});
//   });

// })
// module.exports = router;

// ************************************°°°°°°°°°*********************


const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsController'); // Adjust the path to leadsController
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');

// Route to get leads with pagination and search
router.get('/leads', AdminValidationMiddleware, (req, res) => {
  const db = req.db;
  if (!db) {
    return res.status(500).json({ message: 'Database connection error' });
  }

  const page = parseInt(req.query.page, 10) || 1; // Page number
  const pageSize = parseInt(req.query.pageSize, 10) || 100; // Number of items per page
  const searchQuery = req.query.search || ''; // Search query
  const offset = (page - 1) * pageSize;

  let query = 'SELECT * FROM leads';
  let countQuery = 'SELECT COUNT(*) AS total FROM leads';
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

// Route to insert a new lead
router.post('/leads/insert', (req, res) => {
  const newLead = req.body;
  const authtoken = req.header('authToken');

  // Insert the new lead
  req.db.query('INSERT INTO leads SET ?', newLead, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...newLead });
  });
});

// Route to update an existing lead
router.put('/leads/update/:id', AdminValidationMiddleware, leadsController.updateLead);

// Route to insert a new lead using the leadsController
router.put('/insert/leads', AdminValidationMiddleware, leadsController.insertLead);

// Route to delete a batch
router.delete('/leads/delete/:id', AdminValidationMiddleware, leadsController.deleteLead);


// router.get("/leads/search/:keyword", AdminValidationMiddleware, (req, res) => {
//   const searchKeyWord = req.params.keyword;

//   // Use parameterized queries to prevent SQL injection
//   const getColumnsQuery = `
//     SELECT * FROM whiteboxqa.leads
//     WHERE CONCAT_WS(' ',name) LIKE ?;`;

//   // Execute the query
//   req.db.query(getColumnsQuery, [`%${searchKeyWord}%`], (error, results, fields) => {
//     if (error) {
//       console.error('Error executing query:', error.stack);
//       return res.status(500).json({ error: 'An error occurred while fetching data.' });
//     }

//     res.json(results);
//   });
// });

// Modified backend route to handle global search with pagination
router.get("/leads/search", AdminValidationMiddleware, (req, res) => {
  const searchQuery = req.query.search || ''; // Get search query from params
  const page = parseInt(req.query.page, 10) || 1; // Default page = 1
  const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default pageSize = 10
  const offset = (page - 1) * pageSize; // Calculate offset for pagination

  // Use parameterized queries to prevent SQL injection
  const getLeadsQuery = `
    SELECT * FROM whiteboxqa.leads
    WHERE CONCAT_WS(' ', name) LIKE ? 
    LIMIT ? OFFSET ?;`; // Apply LIMIT and OFFSET for pagination

  const totalRowsQuery = `
    SELECT COUNT(*) as totalRows FROM whiteboxqa.leads
    WHERE CONCAT_WS(' ', name) LIKE ?;`; // Query to get total rows for pagination

  // Execute the query to get the total number of rows that match the search
  req.db.query(totalRowsQuery, [`%${searchQuery}%`], (err, totalResults) => {
    if (err) {
      console.error('Error executing totalRowsQuery:', err.stack);
      return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }

    const totalRows = totalResults[0].totalRows;

    // Execute the query to get the leads data based on pagination and search
    req.db.query(getLeadsQuery, [`%${searchQuery}%`, pageSize, offset], (error, results) => {
      if (error) {
        console.error('Error executing getLeadsQuery:', error.stack);
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