const { getTenantConnection } = require('../tenant/tenantManager');
const LeadModel = require('../models/Lead');

let leads = [];

// POST: Create a new lead
const createLead = async (req, res) => {

    const { tenantid } = req.headers; 
    if (!tenantid) return res.status(400).json({ error: 'Tenant ID is required.' });

    const { name, email, traffic_source } = req.body;

    if (!name || !email || !traffic_source) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Connect to tenant's database
        const tenantDb = await getTenantConnection(tenantid);

        // Initialize Lead model for the tenant
        const Lead = LeadModel(tenantDb);

        // Sync model and create the lead
        await tenantDb.sync();
        const newLead = await Lead.create({ id: leads.length + 1, name, email, traffic_source, interactions: [] });

        return res.status(201).json({ message: 'Lead created successfully.', lead: newLead });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create lead.' });
    }
};

// GET: Fetch all leads
const getAllLeads = async (req, res) => {
    const { tenantid } = req.headers; 
    const { traffic_source } = req.query; 

    try {
        const tenantDb = await getTenantConnection(tenantid);

        const Lead = LeadModel(tenantDb);

        let leads;
        if (traffic_source) {
            leads = await Lead.findAll({
                where: { traffic_source },
            });
        } else {
            leads = await Lead.findAll();
        }

        return res.status(200).json({ leads });
    } catch (error) {
        console.error('Error fetching leads:', error);
        return res.status(500).json({ error: 'Failed to fetch leads.' });
    }
};

// GET: Fetch a single lead by ID
const getLeadById = async (req, res) => {
    const { tenantid } = req.headers;
    const { id } = req.params;

    try {
        const tenantDb = await getTenantConnection(tenantid);

        const Lead = LeadModel(tenantDb);

        const lead = await Lead.findByPk(id);

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found.' });
        }

        return res.status(200).json({ lead });
    } catch (error) {
        console.error('Error fetching lead by ID:', error);
        return res.status(500).json({ error: 'Failed to fetch lead by ID.' });
    }
};

// POST: Assign a score to a lead
const assignLeadScore = async (req, res) => {
    const { tenantid } = req.headers;
    const { id } = req.params;
    const { score } = req.body;

    try {
        const tenantDb = await getTenantConnection(tenantid);

        const Lead = LeadModel(tenantDb);

        const lead = await Lead.findByPk(id);

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found.' });
        }

        lead.score = score;
        await lead.save();

        return res.status(200).json({ message: 'Score assigned successfully.', lead });
    } catch (error) {
        console.error('Error assigning score:', error);
        return res.status(500).json({ error: 'Failed to assign score to lead.' });
    }
};


// GET: Get aggregated lead scores
const getLeadScores = async (req, res) => {
    const { tenantid } = req.headers;

    try {
        const tenantDb = await getTenantConnection(tenantid);

        const Lead = LeadModel(tenantDb);

        const leads = await Lead.findAll();

        const scoresSummary = leads.reduce(
            (acc, lead) => {
                acc.total += lead.score || 0;
                acc.count += 1;
                return acc;
            },
            { total: 0, count: 0 }
        );

        scoresSummary.average = scoresSummary.count
            ? scoresSummary.total / scoresSummary.count
            : 0;

        return res.status(200).json({ scoresSummary });
    } catch (error) {
        console.error('Error fetching lead scores:', error);
        return res.status(500).json({ error: 'Failed to fetch lead scores.' });
    }
};



module.exports = { createLead, getAllLeads, getLeadById, assignLeadScore, getLeadScores };
