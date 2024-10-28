

require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const leadsRoutes = require('./routes/leadsRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const batchRoutes = require('./routes/batchRoutes'); // Import the batchRoutes
const accessRoutes = require('./routes/accessRoutes');
const poRoutes = require('./routes/poRoutes');
const placementRoutes = require('./routes/placementRoutes');
const bymonthRoutes = require('./routes/bymonthRoutes');
const clientRoutes = require('./routes/clientRoutes');
const bypoRoutes = require('./routes/bypoRoutes');
const overdueRoutes = require('./routes/overdueRoutes');
const vendorRoutes = require('./routes/vendorRoutes'); // Add the placementRoutes
const db = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Make db available to routes via middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});
const basePath = "/api/admin"
app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}`, leadsRoutes);
app.use(`${basePath}`, candidateRoutes);
app.use(`${basePath}/batches`, batchRoutes); // Add the batchRoutes
app.use(`${basePath}`, accessRoutes);
app.use(`${basePath}`, poRoutes);
app.use(`${basePath}`, placementRoutes);
app.use(`${basePath}`, bymonthRoutes);
app.use(`${basePath}`, clientRoutes);
app.use(`${basePath}`, bypoRoutes);
app.use(`${basePath}`, overdueRoutes);
app.use(`${basePath}`, vendorRoutes);

const PORT = process.env.PORT || 8005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

