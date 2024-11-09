// searchController.js

const pool = require('../db');

// Search candidates by name
const searchCandidatesByName = (req, res) => {
  const { name } = req.query;
  console.log(name)
  const query = `
     SELECT * 
  FROM whiteboxqa.candidate
  WHERE name LIKE '%${name}%';
`;
  const params = [`%${name}%`];

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json(results);
  });
};

module.exports = { searchCandidatesByName };
