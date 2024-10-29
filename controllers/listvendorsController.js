// const Vendor = require('../models/Vendor'); // Assuming you have a Vendor model

exports.getAllVendors = async (req, res) => {
    const db = req.db; // Access the database connection from the request
    if (!db) {
      return res.status(500).json({ message: "Database connection error" });
    }

    // Query to fetch all vendors with the same columns as in the PHP script
    const query = `
      SELECT id, name, email, phone, designation, vendorid,
             (SELECT IFNULL(companyname, ' ') FROM vendor WHERE id = vendorid) AS comp,
             status, dob, personalemail, skypeid, linkedin, twitter, facebook, review, notes
      FROM recruiter
      WHERE clientid = 0
    `;

'SELECT id,name,email,phone,designation,vendorid,(select ifnull(companyname, " ") from vendor where id = vendorid) comp, status,dob,personalemail,skypeid,linkedin,twitter,facebook,review,notes FROM recruiter where clientid = 0 ';


    db.query(query, (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // Return the fetched vendors
      res.json({ data: results });
    });
  };



exports.addVendor = async (req, res) => {
  try {
    const newVendor = new Vendor(req.body);
    const savedVendor = await newVendor.save();
    res.status(201).json(savedVendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json(updatedVendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.viewVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
