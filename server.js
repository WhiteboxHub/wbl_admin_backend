

require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const leadsRoutes = require('./routes/leadsRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const batchRoutes = require('./routes/batchRoutes'); // Import the batchRoutes
const accessRoutes =require('./routes/accessRoutes');
const employeeRoutes =require('./routes/employeeRoutes');
const mysql = require('mysql2');
const pool =require('./db')
const app = express();

// ------------------old database connection---------------------


// --------------------------------------------------------------

// // Create and configure the database connection
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


// -----------***********---------------------

// -------------------------------------------

pool.getConnection((err,connection)=>{
  if(err)
  {
    console.err('connection failed:',err.stack)
    return;
  }
  else{
    console.log("connection success"); 
  }
})

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Make db available to routes via middleware
app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.use('/api/admin/auth', authRoutes);
app.use('/api/admin', leadsRoutes);
app.use('/api/admin', candidateRoutes);
app.use('/api/admin', batchRoutes); // Add the batchRoutes
app.use('/api/admin',accessRoutes);
app.use('/api/admin',employeeRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

