
// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'innova-path'; // Using 'innova-path' as the JWT secret key

const login = (req, res) => {
  const { username, password } = req.body;
  const db = req.db;

  // Query to check user credentials from the 'authuser' table
  db.query('SELECT * FROM whiteboxqa.authuser WHERE uname = ?', [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];

    // Directly compare the plaintext password with the password stored in the database
    if (password === user.passwd) {
      // Create a JWT
      const token = jwt.sign({ id: user.id, username: user.uname }, SECRET_KEY, { expiresIn: '1h' });

      return res.json({ token, message: `Welcome back, ${user.uname}!` });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  });
};

module.exports = { login };
