const db = require('../db');

// Get all detailed client data
exports.getDetailedClient = (req, res) => {
    console.log('GET request received to fetch all detailed client data');

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 100;

    // Calculate the offset for pagination
    const offset = (page - 1) * pageSize;

    // Query to retrieve all detailed client data with the specified fields
    const query = `
        SELECT
            id,
            name,
            email,
            phone,
            designation,
            clientid,
            (SELECT IFNULL(companyname, " ") FROM client WHERE id = clientid) AS comp,
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
            vendorid = 0
            AND clientid <> 0
            AND (name IS NOT NULL AND LENGTH(name) > 1)
            AND (phone IS NOT NULL AND LENGTH(phone) > 1)
            AND (designation IS NOT NULL AND LENGTH(designation) > 1)

    `;

    db.query(query, [pageSize, offset], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        // Return all the detailed client data
        return res.status(200).json(results);
    });
};

// Update a detailed client
exports.updateDetailedClient = async (req, res) => {
    try {
        const { name, email, phone, designation, clientid, status, dob, personalemail, skypeid, linkedin, twitter, facebook, review, notes } = req.body;
        const [result] = await db.query(
            `UPDATE recruiter
             SET name = ?, email = ?, phone = ?, designation = ?, clientid = ?, status = ?, dob = ?, personalemail = ?, skypeid = ?, linkedin = ?, twitter = ?, facebook = ?, review = ?, notes = ?
             WHERE id = ?`,
            [name, email, phone, designation, clientid, status, dob, personalemail, skypeid, linkedin, twitter, facebook, review, notes, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Detailed client not found' });
        }
        res.status(200).json({ id: req.params.id, ...req.body });
    } catch (error) {
        res.status(500).json({ message: 'Error updating detailed client', error });
    }
};

// View a detailed client by ID
exports.viewDetailedClientById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM recruiter WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Detailed client not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching detailed client', error });
    }
};

// Delete a detailed client
exports.deleteDetailedClient = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM recruiter WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Detailed client not found' });
        }
        res.status(200).json({ message: 'Detailed client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting detailed client', error });
    }
};
