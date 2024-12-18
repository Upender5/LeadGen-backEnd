const express = require('express');
const {
  trackVisitorInteraction,
  getVisitorInteractions,
} = require('../controllers/visitorController');

const router = express.Router();

// POST: Track visitor interaction
router.post('/track', trackVisitorInteraction);

// GET: Fetch visitor interactions
router.get('/interactions', getVisitorInteractions);

module.exports = router;
