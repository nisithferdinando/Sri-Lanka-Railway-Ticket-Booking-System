const express = require('express');
const router = express.Router();

const authenticateToken = require('../Utilities/utiliies');
const { saveBookingDetails, getBookingHistory, cancelBooking, applyForRefund, processRefund } = require('../Controllers/bookingController');

router.post('/saveBooking', saveBookingDetails);
router.get('/history', authenticateToken, getBookingHistory);
router.post('/:bookingId/cancel', authenticateToken, cancelBooking);
router.post('/:bookingId/apply-refund', authenticateToken, applyForRefund);

module.exports = router;
