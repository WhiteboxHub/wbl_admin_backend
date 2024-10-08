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

// Update a user
const updateUser = (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  // Ensure userId and updatedUser are present
  if (!userId || !updatedUser) {
    return res.status(400).json({ message: 'User ID and data are required' });
  }

  // Update the user
  db.query('UPDATE authuser SET ? WHERE id = ?', [updatedUser, userId], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ id: userId, ...updatedUser });
  });
};

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
