// routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const authenticateToken = require('../Utilities/utiliies');

router.post('/saveBooking', bookingController.saveBookingDetails);
router.get('/history', authenticateToken, bookingController.getBookingHistory);

module.exports = router;
