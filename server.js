// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const leadsRoutes = require('./routes/leadsRoutes');
// const mysql = require('mysql2');

// const app = express();

// // Create and configure the database connection
// const db = mysql.createConnection({
//   host: '35.232.56.51',
//   user: 'whiteboxqa',
//   password: 'Innovapath1',
//   database: 'whiteboxqa',
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to database');
// });

// app.use(bodyParser.json());

// app.use(cors());
// app.use(express.json());


// // Make db available to routes via middleware
// app.use((req, res, next) => {
//   req.db = db;
//   next();
// });

// app.use('/api/auth', authRoutes);
// app.use('/api', leadsRoutes);

// const PORT = process.env.PORT || 8001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const leadsRoutes = require('./routes/leadsRoutes');
// const candidateRoutes = require('./routes/candidateRoutes')
const batchRoutes = require('./routes/batchRoutes'); // Import the batchRoutes
const candidateRoutes=require('./routes/candidateRoutes');
const mysql = require('mysql2');

const app = express();

// Create and configure the database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


// Make db available to routes via middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/api/admin/auth', authRoutes);
app.use('/api/admin', leadsRoutes);
app.use('/api/admin', candidateRoutes);
app.use('/api/admin', batchRoutes); // Add the batchRoutes

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// require('dotenv').config(); // Load environment variables from .env file

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const leadsRoutes = require('./routes/leadsRoutes');
// const jwt = require('jsonwebtoken');

// const app = express();

// const SECRET_KEY = process.env.SECRET_KEY;

// // Create and configure the database connection
// const mysql = require('mysql2');
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to database');
// });

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

//   if (token == null) return res.status(401).json({ message: 'Unauthorized' });

//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Forbidden' });
//     req.user = user;
//     next();
//   });
// };

// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.json());

// // Make db available to routes via middleware
// app.use((req, res, next) => {
//   req.db = db;
//   next();
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/leads', authenticateToken, leadsRoutes); // Apply authentication middleware

// const PORT = process.env.PORT || 8001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
