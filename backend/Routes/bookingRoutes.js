
const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const authenticateToken = require('../Utilities/utiliies');

router.post('/saveBooking', bookingController.saveBookingDetails);
router.get('/history', authenticateToken, bookingController.getBookingHistory);
router.post('/:bookingId/cancel', authenticateToken, bookingController.cancelBooking);

module.exports = router;
