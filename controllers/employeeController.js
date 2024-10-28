const mysql = require('mysql2');
const pool = require('../db')
// // Connect to the database
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// });

const getEmployees = (req, res) => {
  db.query(` SELECT id, name, email, phone, status, startdate, mgrid, designationid, 
personalemail, personalphone, dob, address, city, state, country, zip, skypeid, 
salary, commission, commissionrate, type, empagreementurl, offerletterurl, dlurl, 
workpermiturl, contracturl, enddate, loginid, responsibilities, notes FROM employee ORDER BY startdate DESC `, 
    (err, results) => {

  pool.query('SELECT * FROM employee', (err, results) => {

    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
})};

const insertEmployee = (req, res) => {
  const newEmployee = req.body;

  // Make sure to sanitize and validate input data as necessary
  pool.query('INSERT INTO employee SET ?', newEmployee, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...newEmployee });
  });
};

// Update an employee
const updateEmployee = (req, res) => {
  const employeeId = req.params.id;
  const updatedEmployee = req.body;

  // Ensure employeeId and updatedEmployee are present
  if (!employeeId || !updatedEmployee) {
    return res.status(400).json({ message: 'Employee ID and data are required' });
  }

  // Update the employee
  pool.query('UPDATE employee SET ? WHERE id = ?', [updatedEmployee, employeeId], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ id: employeeId, ...updatedEmployee });
  });
};

const deleteEmployee = (req, res) => {
  const employeeId = req.params.id;

  // Ensure employeeId is provided
  if (!employeeId) {
    return res.status(400).json({ message: 'Employee ID is required' });
  }

  // Perform the delete operation
  pool.query('DELETE FROM employee WHERE id = ?', [employeeId], (err, results) => {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Check if any row was affected
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Employee deleted successfully' });
  });
};

module.exports = { getEmployees, insertEmployee, updateEmployee, deleteEmployee };
