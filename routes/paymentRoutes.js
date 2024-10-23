// routes/paymentRoutes.js
const express = require('express');
const { createPaymentIntent, completeBooking } = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create-payment-intent', authMiddleware, createPaymentIntent);
router.post('/complete-booking', authMiddleware, completeBooking);

module.exports = router;
