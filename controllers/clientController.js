// // const pool = require("../db"); // Assuming a db connection is exported from "../db"
// // Get all clients
// exports.getClients = async (req, res) => {
//   const db = req.db;
  

//   try {
//     const query = `
  // SELECT
  //   id,
  //   companyname,
  //   email,
  //   phone,
  //   status,
  //   url,
  //   fax,
  //   address,
  //   city,
  //   state,
  //   country,
  //   twitter,
  //   linkedin,
  //   facebook,
  //   zip,
  //   manager1name,
  //   manager1email,
  //   manager1phone,
  //   hmname,
  //   hmemail,
  //   hmphone,
  //   hrname,
  //   hremail,
  //   hrphone,
  //   notes
  // FROM client
//     `;

//     // Execute the query
//     const result = await db.query(query);
    
//     console.log("Database query result:", result); // Log the result for debugging

//     // // Check if result is iterable
//     // if (Array.isArray(result)) {
//     //   // Return the fetched clients
//     //   res.json({ data: result });
//     // } else if (result && result[0]) {
//     //   // If result is not an array, but has results in another property (like 'rows')
//     //   res.json({ data: result[0] }); // Adjust based on the actual structure
//     // } else {
//     //   res.json({ data: [] }); // No results found
//     // }
//     // console.log("Query Results:", JSON.stringify(result, null, 2));
//     // const datab = result.split("\n")
//     // res.json({ data: datab})
//     // res.send(result)
//   } catch (err) {
//     console.error("Database query error:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };

exports.getClients = async (req, res) => {
  const db = req.db; // Access the database connection from the request
  if (!db) {
    return res.status(500).json({ message: "Database connection error" });
  }

  // Query to fetch all vendors with the same columns as in the PHP script
  const query = `
     SELECT
    id,
    companyname,
    email,
    phone,
    status,
    url,
    fax,
    address,
    city,
    state,
    country,
    twitter,
    linkedin,
    facebook,
    zip,
    manager1name,
    manager1email,
    manager1phone,
    hmname,
    hmemail,
    hmphone,
    hrname,
    hremail,
    hrphone,
    notes
  FROM client
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Return the fetched vendors
    res.json({ data: results });
  });
};




// Add new client
exports.addClient = async (req, res) => {
  const db = req.db; 
  try {
    const {
      companyname,
      email,
      phone,
      status,
      url,
      fax,
      address,
      city,
      state,
      country,
      twitter,
      linkedin,
      facebook,
      zip,
      manager1name,
      manager1email,
      manager1phone,
      hmname,
      hmemail,
      hmphone,
      hrname,
      hremail,
      hrphone,
      notes
    } = req.body;
    const query = `
      INSERT INTO client (
        companyname,
        email,
        phone,
        status,
        url,
        fax,
        address,
        city,
        state,
        country,
        twitter,
        linkedin,
        facebook,
        zip,
        manager1name,
        manager1email,
        manager1phone,
        hmname,
        hmemail,
        hmphone,
        hrname,
        hremail,
        hrphone,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(query, [
      companyname,
      email,
      phone,
      status,
      url,
      fax,
      address,
      city,
      state,
      country,
      twitter,
      linkedin,
      facebook,
      zip,
      manager1name,
      manager1email,
      manager1phone,
      hmname,
      hmemail,
      hmphone,
      hrname,
      hremail,
      hrphone,
      notes
    ]);
    res.status(201).json({ message: "Client added successfully" });
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  const db = req.db; 

  try {
    const { id } = req.params;
    const {
      companyname,
      email,
      phone,
      status,
      url,
      fax,
      address,
      city,
      state,
      country,
      twitter,
      linkedin,
      facebook,
      zip,
      manager1name,
      manager1email,
      manager1phone,
      hmname,
      hmemail,
      hmphone,
      hrname,
      hremail,
      hrphone,
      notes
    } = req.body;
    const query = `
      UPDATE client
      SET
        companyname = ?,
        email = ?,
        phone = ?,
        status = ?,
        url = ?,
        fax = ?,
        address = ?,
        city = ?,
        state = ?,
        country = ?,
        twitter = ?,
        linkedin = ?,
        facebook = ?,
        zip = ?,
        manager1name = ?,
        manager1email = ?,
        manager1phone = ?,
        hmname = ?,
        hmemail = ?,
        hmphone = ?,
        hrname = ?,
        hremail = ?,
        hrphone = ?,
        notes = ?
      WHERE id = ?
    `;
    await db.query(query, [
      companyname,
      email,
      phone,
      status,
      url,
      fax,
      address,
      city,
      state,
      country,
      twitter,
      linkedin,
      facebook,
      zip,
      manager1name,
      manager1email,
      manager1phone,
      hmname,
      hmemail,
      hmphone,
      hrname,
      hremail,
      hrphone,
      notes,
      id
    ]);
    res.json({ message: "Client updated successfully" });
  } catch (err) {
    console.error("Database update error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// View client by ID
exports.viewClientById = async (req, res) => {
  const db = req.db; 

  try {
    const { id } = req.params;
    const query = `
      SELECT
        id,
        companyname,
        email,
        phone,
        status,
        url,
        fax,
        address,
        city,
        state,
        country,
        twitter,
        linkedin,
        facebook,
        zip,
        manager1name,
        manager1email,
        manager1phone,
        hmname,
        hmemail,
        hmphone,
        hrname,
        hremail,
        hrphone,
        notes
      FROM client
      WHERE id = ?
    `;
    const [results] = await db.query(query, [id]);
    res.json({ data: results[0] });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  const db = req.db; 

  try {
    const { id } = req.params;
    const query = `
      DELETE FROM client
      WHERE id = ?
    `;
    await db.query(query, [id]);
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error("Database delete error:", err);
    res.status(500).json({ message: "Database error" });
  }
};