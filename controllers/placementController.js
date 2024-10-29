
const db = require('../db');

// Get all placements
exports.getPlacements = (req, res) => {
    console.log('GET request received to fetch all placements');

    // Query to retrieve all placements with the specified fields, ordered by id in descending order
    const query = `
        SELECT
            p.id AS ID,
            c.name AS Candidate_Name,
            e.name AS Manager,
            CONCAT(r.name, '-', v.companyname) AS Recruiter,
            v1.companyname AS Vendor1,
            p.masteragreementid AS MSA_ID,
            p.otheragreementsids AS Other_AgrID,
            v2.companyname AS Vendor2,
            v3.companyname AS Vendor3,
            cl.companyname AS Client,
            p.startdate AS Start_Date,
            p.enddate AS End_Date,
            p.status AS Status,
            p.paperwork AS Paperwork,
            p.insurance AS Insurance,
            p.wrklocation AS Wrk_Location,
            p.wrkdesignation AS Wrk_Designation,
            p.wrkemail AS Wrk_Email,
            p.wrkphone AS Wrk_Phone,
            p.mgrname AS Mgr_Name,
            p.mgremail AS Mgr_Email,
            p.mgrphone AS Mgr_Phone,
            p.hiringmgrname AS Hiring_Mgr_Name,
            p.hiringmgremail AS Hiring_Mgr_Email,
            p.hiringmgrphone AS Hiring_Mgr_Phone,
            p.reference AS Reference,
            p.ipemailclear AS IPEmail_Clear,
            f.name AS Feedback_ID,
            p.projectdocs AS Project_Docs,
            p.notes AS Notes
        FROM
            placement p
        LEFT JOIN
            candidate c ON p.candidateid = c.candidateid
        LEFT JOIN
            employee e ON p.mmid = e.id
        LEFT JOIN
            recruiter r ON p.recruiterid = r.id
        LEFT JOIN
            vendor v ON r.vendorid = v.id
        LEFT JOIN
            vendor v1 ON p.vendorid = v1.id
        LEFT JOIN
            vendor v2 ON p.vendor2id = v2.id
        LEFT JOIN
            vendor v3 ON p.vendor3id = v3.id
        LEFT JOIN
            client cl ON p.clientid = cl.id
        LEFT JOIN
            feedback f ON p.feedbackid = f.id
        ORDER BY p.id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        // Return all the placements
        return res.status(200).json(results);
    });
};

  

exports.updatePlacements = async (req, res) => {
    try {
        const { candidateid, mmid, recruiterid, vendorid, masteragreementid, otheragreementsids, vendor2id, vendor3id, clientid, startdate, enddate, status, paperwork, insurance, wrklocation, wrkdesignation, wrkemail, wrkphone, mgrname, mgremail, mgrphone, hiringmgrname, hiringmgremail, hiringmgrphone, reference, ipemailclear, feedbackid, projectdocs, notes } = req.body;
        const [result] = await db.query(
            `UPDATE placement
             SET candidateid = ?, mmid = ?, recruiterid = ?, vendorid = ?, masteragreementid = ?, otheragreementsids = ?, vendor2id = ?, vendor3id = ?, clientid = ?, startdate = ?, enddate = ?, status = ?, paperwork = ?, insurance = ?, wrklocation = ?, wrkdesignation = ?, wrkemail = ?, wrkphone = ?, mgrname = ?, mgremail = ?, mgrphone = ?, hiringmgrname = ?, hiringmgremail = ?, hiringmgrphone = ?, reference = ?, ipemailclear = ?, feedbackid = ?, projectdocs = ?, notes = ?
             WHERE id = ?`,
            [candidateid, mmid, recruiterid, vendorid, masteragreementid, otheragreementsids, vendor2id, vendor3id, clientid, startdate, enddate, status, paperwork, insurance, wrklocation, wrkdesignation, wrkemail, wrkphone, mgrname, mgremail, mgrphone, hiringmgrname, hiringmgremail, hiringmgrphone, reference, ipemailclear, feedbackid, projectdocs, notes, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Placement not found' });
        }
        res.status(200).json({ id: req.params.id, ...req.body });
    } catch (error) {
        res.status(500).json({ message: 'Error updating placement', error });
    }
};

exports.viewPlacementById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM placement WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Placement not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching placement', error });
    }
};

exports.deletePlacement = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM placement WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Placement not found' });
        }
        res.status(200).json({ message: 'Placement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting placement', error });
    }
};