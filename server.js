require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const leadsRoutes = require('./routes/leadsRoutes');
const candidateRoutes = require('./routes/candidateRoutes')
const batchRoutes = require('./routes/batchRoutes'); // Import the batchRoutes
const accessRoutes =require('./routes/accessRoutes');
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
app.use('/api/admin',accessRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




