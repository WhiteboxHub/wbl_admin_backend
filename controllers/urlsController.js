// const Url = require('../models/Url'); // Assuming you have a Url model
exports.getUrls = async (req, res) => {
    const db = req.db; // Access the database connection from the request
    if (!db) {
      return res.status(500).json({ message: "Database connection error" });
    }
  
    // Query to fetch URLs with the specified columns
    const query = `
      SELECT
        id,
        url
      FROM sales_url_db
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Database error" });
      }
  
      // Return the fetched URLs
      res.json({ data: results });
    });
  };
  

exports.addUrl = async (urlData) => {
  const newUrl = new Url(urlData);
  await newUrl.save();
  return newUrl;
};

exports.updateUrl = async (id, urlData) => {
  const updatedUrl = await Url.findByIdAndUpdate(id, urlData, { new: true });
  return updatedUrl;
};

exports.viewUrlById = async (id) => {
  const url = await Url.findById(id);
  return url;
};

exports.deleteUrl = async (id) => {
  await Url.findByIdAndDelete(id);
};
