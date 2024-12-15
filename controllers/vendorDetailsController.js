const db = require('../db');

// Get all vendor details
exports.getVendorDetails = (req, res) => {
    console.log('GET request received to fetch all vendor details');

    // Query to retrieve all vendor details with the specified fields
    const query = `
        SELECT
            id,
            name,
            email,
            phone,
            designation,
            vendorid,
            (SELECT IFNULL(companyname, " ") FROM vendor WHERE id = vendorid) AS comp,
            status,
            dob,
            personalemail,
            skypeid,
            linkedin,
            twitter,
            facebook,
            review,
            notes
        FROM
            recruiter
        WHERE
            clientid = 0
            AND vendorid <> 0
            AND (name IS NOT NULL AND LENGTH(name) > 1)
            AND (phone IS NOT NULL AND LENGTH(phone) > 1)
            AND (designation IS NOT NULL AND LENGTH(designation) > 1)
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        // Return all the vendor details
        return res.status(200).json(results);
    });
};

// Update a vendor detail
exports.updateVendorDetail = async (req, res) => {
    try {
        const { name, email, phone, designation, vendorid, status, dob, personalemail, skypeid, linkedin, twitter, facebook, review, notes } = req.body;
        const [result] = await db.query(
            `UPDATE recruiter
             SET name = ?, email = ?, phone = ?, designation = ?, vendorid = ?, status = ?, dob = ?, personalemail = ?, skypeid = ?, linkedin = ?, twitter = ?, facebook = ?, review = ?, notes = ?
             WHERE id = ?`,
            [name, email, phone, designation, vendorid, status, dob, personalemail, skypeid, linkedin, twitter, facebook, review, notes, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendor detail not found' });
        }
        res.status(200).json({ id: req.params.id, ...req.body });
    } catch (error) {
        res.status(500).json({ message: 'Error updating vendor detail', error });
    }
};

// View a vendor detail by ID
exports.viewVendorDetailById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM recruiter WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Vendor detail not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendor detail', error });
    }
};

// Delete a vendor detail
exports.deleteVendorDetail = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM recruiter WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendor detail not found' });
        }
        res.status(200).json({ message: 'Vendor detail deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vendor detail', error });
    }
};
