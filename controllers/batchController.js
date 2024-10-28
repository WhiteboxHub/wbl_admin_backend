const mysql = require('mysql2');
const pool = require('../db')


// Get all batches
const getBatches = (req, res) => {
  pool.query('SELECT * FROM batch', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

// Insert a new batch
const insertBatch = (req, res) => {
  const db=req.db;
  const newBatch = req.body;

  // Make sure to sanitize and validate input data as necessary
  db.query('INSERT INTO batch SET ?', newBatch, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...newBatch });
  });
};

// Update a batch
const updateBatch = (req, res) => {
  const batchId = req.params.id;
  const updatedBatch = req.body;
  console.log('PUT request received for ID:', batchId);

  // Ensure batchId and updatedBatch are present
  if (!batchId || !updatedBatch) {
    return res.status(400).json({ message: 'Batch ID and data are required' });
  }

  // Update the batch
  pool.query('UPDATE batch SET ? WHERE batchid = ?', [updatedBatch, batchId], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ batchid: batchId, ...updatedBatch });
  });
};


// Delete a batch
const deleteBatch = (req, res) => {
  const batchId = req.params.id;

  // Ensure batchId is provided
  if (!batchId) {
      return res.status(400).json({ message: 'Batch ID is required' });
  }

  // Perform the delete operation
  pool.query('DELETE FROM batch WHERE batchid = ?', [batchId], (err, results) => {
      if (err) {
          console.error('Database delete error:', err);
          return res.status(500).json({ message: 'Database error' });
      }

      // Check if any row was affected
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Batch not found' });
      }

      // Respond with a success message
      res.status(200).json({ message: 'Batch deleted successfully' });
  });
};

module.exports = { getBatches, insertBatch, updateBatch,  deleteBatch };


// // Route to search for batches by keyword
// const searchBatches = (req, res) => {
//   const searchKeyWord = req.params.keyword;

//   // Use parameterized queries to prevent SQL injection
//   const getColumnsQuery = `
//     SELECT * FROM batch
//     WHERE 
//       batchname LIKE ? OR 
//       courseid LIKE ? OR 
//       subject LIKE ? OR 
//       instructor1 LIKE ? OR 
//       instructor2 LIKE ? OR 
//       instructor3 LIKE ? OR 
//       topicscovered LIKE ? OR 
//       topicsnotcovered LIKE ?
//   `;

//   // Prepare the parameters for the query
//   const params = [
//     `%${searchKeyWord}%`,
//     `%${searchKeyWord}%`,
//     `%${searchKeyWord}%`,
//     `%${searchKeyWord}%`,
//     `%${searchKeyWord}%`,
//     `%${searchKeyWord}%`,
//     `%${searchKeyWord}%`,
//     `%${searchKeyWord}%`
//   ];

//   // Execute the query
//   req.db.query(getColumnsQuery, params, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error.stack);
//       return res.status(500).json({ error: 'An error occurred while fetching data.' });
//     }

//     res.json({ data: results });
//   });
// };


//module.exports = { getBatches, insertBatch, updateBatch, deleteBatch, searchBatches };