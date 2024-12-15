const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwt_secret = process.env.SECRET_KEY;


const AdminValidation = async(req,res,next)=>{

    const authHeader = req.header('AuthToken'); // Get token from headers
    console.log(authHeader);
    
 const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  // Verify token
  jwt.verify(authHeader, jwt_secret, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const { username } = decodedToken;

    // Check if the username exists in the database
    const db = req.db; // Assuming the database connection is available in req.db
    db.query('SELECT * FROM whiteboxqa.authuser WHERE uname = ?', [username], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        // No user found with this username
        return res.status(404).json({ message: 'User not found' });
      }

      // User exists, proceed to the next middleware or route handler
      req.user = results[0]; // Attach the user data to the request object for use in subsequent handlers
      next();
    });
  });
}

module.exports = AdminValidation






// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const jwt_secret = process.env.SECRET_KEY;

// // Middleware for Admin Validation
// const AdminValidation = (req, res, next) => {
//   const authHeader = req.header('AuthToken'); // Get token from headers
//   if (!authHeader) {
//     return res.status(401).json({ message: 'Authorization token is missing' });
//   }

//   const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  
//   if (!token) {
//     return res.status(401).json({ message: 'Invalid authorization format' });
//   }

//   jwt.verify(token, jwt_secret, (err, decodedToken) => {
//     if (err) {
//       console.error('JWT verification failed:', err);
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }

//     const { username } = decodedToken;

//     // Ensure database connection exists
//     const db = req.db;
//     if (!db) {
//       console.error('Database connection is not available in the request object');
//       return res.status(500).json({ message: 'Internal server error' });
//     }

//     // Query the database to validate the user
//     db.query('SELECT * FROM whiteboxqa.authuser WHERE uname = ?', [username], (dbErr, results) => {
//       if (dbErr) {
//         console.error('Database query error:', dbErr);
//         return res.status(500).json({ message: 'Failed to validate user' });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       // User is valid; attach user details to the request object
//       req.user = results[0];
//       next();
//     });
//   });
// };

// module.exports = AdminValidation;
