// models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  availability: { type: Boolean, default: true },
  amenities: [String],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Property', propertySchema);
