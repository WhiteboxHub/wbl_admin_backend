

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
const candidateMarketingRoutes =require('./routes/candidateMarketingRoutes');
const marketingCandidatesRoutes =require('./routes/marketingCandidatesRoutes');
// const marketingCandidatesRoutes =require('@/routes/marketingCandidatesRoutes');
const poRoutes = require('./routes/poRoutes');
const placementRoutes =require('./routes/placementRoutes');
const byMonthRoutes = require('./routes/bymonthRoutes');
const byPoRoutes = require('./routes/bypoRoutes');
const overdueRoutes = require('./routes/overdueRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const clientRoutes = require('./routes/clientRoutes');
const urlsRoutes = require('./routes/urlsRoutes');              
const listvendorRoutes = require('./routes/listvendorRoutes');
const detialedvendorRoutes = require('./routes/detailedvendorRoutes');
const listclientRoutes = require('./routes/listclientRoutes');
const detialedclientRoutes = require('./routes/detailedclientRoutes');
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
app.use('/api/admin',candidateMarketingRoutes);
app.use('/api/admin',marketingCandidatesRoutes);
app.use('/api/admin',placementRoutes);
app.use('/api/admin',poRoutes);
app.use('/api/admin',clientRoutes);
app.use('/api/admin',byMonthRoutes);
app.use('/api/admin',byPoRoutes);
app.use('/api/admin',vendorRoutes);
app.use('/api/admin',overdueRoutes);
app.use('/api/admin',urlsRoutes);
app.use('/api/admin',listvendorRoutes);
app.use('/api/admin',listclientRoutes); 
app.use('/api/admin',detialedvendorRoutes); 
app.use('/api/admin',detialedclientRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

