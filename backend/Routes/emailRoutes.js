const express = require('express');
const { sendTickets } = require('../Controllers/emailController');

const router = express.Router();

// Route to send tickets via email
router.post('/send-tickets', sendTickets);

module.exports = router;