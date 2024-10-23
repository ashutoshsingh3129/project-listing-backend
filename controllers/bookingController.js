// controllers/bookingController.js
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// Helper function to get the start of the day for a given date
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // Set time to 00:00:00
  return d;
};

// Helper function to get the start of the next day
const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
  return d;
};

exports.createBooking = async (req, res) => {
  const { propertyId, date } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) return res.status(404).json({ error: 'Property not found' });

  if (!property.availability) {
    return res.status(400).json({ error: 'Property is not available for booking' });
  }

  // Define start and end of the booking date to only check for the day (ignore time)
  const start = startOfDay(date);
  const end = endOfDay(date);

  // Check if there is a booking for the property on the same date (ignoring time)
  const existingBooking = await Booking.findOne({
    property: propertyId,
    date: { $gte: start, $lt: end }, // Query for the day only
  });

  if (existingBooking) {
    return res.status(400).json({ error: 'Property already booked for this date' });
  }

  // Create new booking
  const booking = new Booking({ user: req.user.id, property: propertyId, date: start }); // Store only the start of the day
  await booking.save();

  res.json(booking);
};
