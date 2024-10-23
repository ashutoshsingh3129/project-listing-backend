// controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Property = require('../models/Property');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, propertyId, bookingDate } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe requires amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    // Return the client secret to the frontend
    res.json({
      clientSecret: paymentIntent.client_secret,
      propertyId,
      bookingDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment intent creation failed' });
  }
};
exports.completeBooking = async (req, res) => {
    const { paymentIntentId, propertyId, bookingDate } = req.body;
  
    // Verify the payment
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment failed or not completed' });
    }
  
    // Create booking record in database
    const booking = new Booking({
      user: req.user.id,
      property: propertyId,
      date: bookingDate,
    });
  
    await booking.save();
  
    res.json({ message: 'Booking completed successfully', booking });
  };
  