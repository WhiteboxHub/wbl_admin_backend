// const mysql = require('mysql2');

// // Connect to the database
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// });

// const getUsers = (req, res) => {
//   db.query('SELECT * FROM authuser', (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
//     res.json(results);
//   });
// };

// const insertUser = (req, res) => {
//   const newUser = req.body;

//   // Make sure to sanitize and validate input data as necessary
//   db.query('INSERT INTO authuser SET ?', newUser, (err, results) => {
//     if (err) {
//       console.error('Database insert error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
//     res.status(201).json({ id: results.insertId, ...newUser });
//   });
// };

// // Update a user
// const updateUser = (req, res) => {
//   const userId = req.params.id;
//   const updatedUser = req.body;

//   // Ensure userId and updatedUser are present
//   if (!userId || !updatedUser) {
//     return res.status(400).json({ message: 'User ID and data are required' });
//   }

//   // Update the user
//   db.query('UPDATE authuser SET ? WHERE id = ?', [updatedUser, userId], (err, results) => {
//     if (err) {
//       console.error('Database update error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
//     res.status(200).json({ id: userId, ...updatedUser });
//   });
// };

// // Delete a user
// const deleteUser = (req, res) => {
//   const userId = req.params.id;

//   // Ensure userId is provided
//   if (!userId) {
//     return res.status(400).json({ message: 'User ID is required' });
//   }

//   // Perform the delete operation
//   db.query('DELETE FROM authuser WHERE id = ?', [userId], (err, results) => {
//     if (err) {
//       console.error('Database delete error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     // Check if any row was affected
//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Respond with a success message
//     res.status(200).json({ message: 'User deleted successfully' });
//   });
// };

// module.exports = { getUsers, insertUser, updateUser, deleteUser };









const mysql = require('mysql2');

// Connect to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});








// const getUsers = (req, res) => {
//   const query = `
//     SELECT authuser.*, leads.status 
//     FROM authuser 
//     LEFT JOIN leads 
//     ON authuser.id = leads.user_id
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
//     res.json(results);
//     console.log(results)
//   });
// };




const getUsers = (req, res) => {
  db.query('SELECT * FROM authuser', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};
console.log(getUsers);

const insertUser = (req, res) => {
  const newUser = req.body;

  // Make sure to sanitize and validate input data as necessary
  db.query('INSERT INTO authuser SET ?', newUser, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...newUser });
  });
};
//----------------- old working logic-------------------------------------
// Update a user
// const updateUser = (req, res) => {
//   const userId = req.params.id;
//   const updatedUser = req.body;

//   // Ensure userId and updatedUser are present
//   if (!userId || !updatedUser) {
//     return res.status(400).json({ message: 'User ID and data are required' });
//   }

//   // Update the user
//   db.query('UPDATE authuser SET ? WHERE id = ?', [updatedUser, userId], (err, results) => {
//     if (err) {
//       console.error('Database update error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
//     res.status(200).json({ id: userId, ...updatedUser });
//   });
// };

// -*-*-------------new testing logic------------*----------*--
// const updateUser = (req, res) => {
//   const userId = req.params.id;
//   const updatedUser = req.body;

//   // Ensure userId and updatedUser are present
//   if (!userId || !updatedUser) {
//     return res.status(400).json({ message: 'User ID and data are required' });
//   }

//   // Step 1: Update the user in the authuser table
//   db.query('UPDATE authuser SET ? WHERE id = ?', [updatedUser, userId], (err, results) => {
//     if (err) {
//       console.error('Database update error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     // Step 2: Check if the status is 'active' to insert data into the candidate table
//     if (updatedUser.status === 'active') {
//       // Fetch the data from the authuser table
//       db.query('SELECT * FROM authuser WHERE id = ?', [userId], (err, rows) => {
//         if (err) {
//           console.error('Database fetch error:', err);
//           return res.status(500).json({ message: 'Error fetching user data' });
//         }

//         const userData = rows[0];

//         // Step 3: Transform authuser data to match the candidate table schema
//         const candidateData = {
//           name: userData.fullname || 'NA', // fullname in authuser -> name in candidate
//           enrolleddate: userData.registereddate ? new Date(userData.registereddate).toISOString().split('T')[0] : 'NA', // format date
//           email: userData.uname || 'NA', // uname to email
//           phone: userData.phone || 'NA', // phone remains the same
//           address: userData.address || 'NA', // address remains the same
//           city: userData.city || 'NA', // city remains the same
//           zip: userData.zip || 'NA', // zip remains the same
//           state: userData.state || 'NA', // state remains the same
//           country: userData.country || 'NA', // country remains the same
//           status: userData.status || 'NA', // status remains the same
//           // Optional: Default fields in the candidate table
//           course: 'QA', // default course
//           agreement: 'N', // default agreement
//           promissory: 'N', // default promissory
//           driverslicense: 'N', // default drivers license
//           workpermit: 'N', // default work permit
//           batchname: null, // default batchname
//           processflag: 'N', // default process flag
//           defaultprocessflag: 'N' // default process flag
//         };

//         // Step 4: Insert the transformed data into the candidate table
//         db.query('INSERT INTO candidate SET ?', candidateData, (err, insertResults) => {
//           if (err) {
//             console.error('Error inserting into candidate table:', err);
//             return res.status(500).json({ message: 'Error inserting into candidate table' });
//           }

//           // Successfully updated authuser and inserted into candidate
//           res.status(200).json({
//             message: 'User updated and inserted into candidate table',
//             authuserId: userId,
//             candidateId: insertResults.insertId
//           });
//         });
//       });
//     } else {
//       // If status is not 'active', just return success for updating authuser
//       res.status(200).json({ id: userId, ...updatedUser });
//     }
//   });
// };


// ---********---------------working logic ***************-------------------
const updateUser = (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  // Ensure userId and updatedUser are present
  if (!userId || !updatedUser) {
    return res.status(400).json({ message: 'User ID and data are required' });
  }

  // Step 1: Update the user in the authuser table
  db.query('UPDATE authuser SET ? WHERE id = ?', [updatedUser, userId], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Step 2: Check if the status is 'active' to insert data into the candidate table
    if (updatedUser.status === 'active') {
      
      // Fetch the current batch from the batch table where current = 'Y' and subject = 'ML'
      db.query('SELECT batchname FROM batch WHERE current = ? AND subject = ?', ['Y', 'ML'], (err, batchRows) => {
        if (err) {
          console.error('Error fetching batch name:', err);
          return res.status(500).json({ message: 'Error fetching batch name' });
        }
        //  ----------------------need to check with this----------------------------------
         
        // --------------------------------------------------------------------------------
        // If batch is found, use it, otherwise fallback to 'default'
        const batchname = batchRows.length > 0 ? batchRows[0].batchname : 'default';

        // Fetch the user data from the authuser table
        db.query('SELECT * FROM authuser WHERE id = ?', [userId], (err, rows) => {
          if (err) {
            console.error('Database fetch error:', err);
            return res.status(500).json({ message: 'Error fetching user data' });
          }
        // ------------------------------------------------------------------------------------
          const userData = rows[0];

          // Step 3: Transform authuser data to match the candidate table schema
          const candidateData = {
            name: userData.fullname || 'NA', // fullname in authuser -> name in candidate
            enrolleddate: userData.registereddate ? new Date(userData.registereddate).toISOString().split('T')[0] : 'NA', // format date
            email: userData.uname || 'NA', // uname to email
            phone: userData.phone || 'NA', // phone remains the same
            address: userData.address || 'NA', // address remains the same
            city: userData.city || 'NA', // city remains the same
            zip: userData.zip || 'NA', // zip remains the same
            state: userData.state || 'NA', // state remains the same
            country: userData.country || 'NA', // country remains the same
            status: userData.status || 'NA', // status remains the same
            // Optional: Default fields in the candidate table
            course: 'ML', // default course set to 'ML'
            agreement: 'N', // default agreement
            promissory: 'N', // default promissory
            driverslicense: 'N', // default drivers license
            workpermit: 'N', // default work permit
            batchname: batchname, // Use the batchname fetched from batch table
            processflag: 'N', // default process flag
            defaultprocessflag: 'N' // default process flag
          };

          // Step 4: Insert the transformed data into the candidate table
          db.query('INSERT INTO candidate SET ?', candidateData, (err, insertResults) => {
            if (err) {
              console.error('Error inserting into candidate table:', err);
              return res.status(500).json({ message: 'Error inserting into candidate table' });
            }

            // Successfully updated authuser and inserted into candidate
            res.status(200).json({
              message: 'User updated and inserted into candidate table',
              authuserId: userId,
              candidateId: insertResults.insertId
            });
          });
        });
      });
      
    } else {
      // If status is not 'active', just return success for updating authuser
      res.status(200).json({ id: userId, ...updatedUser });
    }
  });
};

// ------------------------------------------------------------------------------------------

const deleteUser = (req, res) => {
  const userId = req.params.id;

  // Ensure userId is provided
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Perform the delete operation
  db.query('DELETE FROM authuser WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Check if any row was affected
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'User deleted successfully' });
  });
};

module.exports = { getUsers, insertUser, updateUser, deleteUser };
