const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment } = require('../Controllers/paymentController');
const authenticateToken = require('../Utilities/utiliies');

router.post('/create-payment-intent', authenticateToken, createPaymentIntent);
router.post('/confirm-payment', authenticateToken, confirmPayment);

module.exports = router;