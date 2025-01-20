require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error in createPaymentIntent:', error);
        res.status(500).json({ error: error.message });
    }
};

const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            res.json({
                success: true,
                payment: paymentIntent
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not successful'
            });
        }
    } catch (error) {
        console.error('Error in confirmPayment:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPaymentIntent,
    confirmPayment
};