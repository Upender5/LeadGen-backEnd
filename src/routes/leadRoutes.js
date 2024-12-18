const express = require('express');
const {
  createLead,
  getAllLeads,
  getLeadById,
  assignLeadScore, 
  getLeadScores
} = require('../controllers/leadController');

const router = express.Router();

// POST: Create a new lead
router.post('/create', createLead);

// GET: Fetch all leads
router.get('/get', getAllLeads);

// GET: Fetch a single lead by ID
router.get('/:id', getLeadById);

// POST: Assign a score to a lead
router.post('/:id/score', assignLeadScore);

// GET: Get aggregated lead scores
router.get('/scores/summary', getLeadScores);

module.exports = router;
