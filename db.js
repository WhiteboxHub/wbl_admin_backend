require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2');

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

function handleDisconnect() {
  pool = mysql.createPool(connectionConfig);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      setTimeout(handleDisconnect, 2000); // Retry after 2 seconds
      return;
    }
    console.log('Connected to the database.');
    connection.release();
  });

  pool.on('error', function(err) {
    console.error('Database connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Connection to the database was lost. Reconnecting...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  pool.end((err) => {
    if (err) {
      console.error('Error closing the database connection:', err.stack);
    }
    process.exit(0);
  });
});

module.exports = pool;

