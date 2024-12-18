const express = require('express');
const { createTenant } = require('../controllers/tenantController');

const router = express.Router();

// POST: Create a new lead
router.post('/create', createTenant);


module.exports = router;
