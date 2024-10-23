// controllers/propertyController.js
const Property = require('../models/Property');
const path = require('path');
const fs = require('fs');

exports.getOneProperties = async (req, res) => {
  try {
    const {id} = req.params;

    const properties = await Property.findById(id);
    res.status(200).json({
      data: properties,
      statusCode: 200,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      statusCode: 500,
      error: error.message
    });
  }
};
exports.getAllProperties = async (req, res) => {
  try {
    const { location, price ,name, availability} = req.query;
    const query = {};
    if (location) query.location = location;
    if (price) {
      const [minPrice, maxPrice] = price.split('-'); // Assuming you send price as a range, e.g., "5000-10000"
      if (minPrice && maxPrice) {
        query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
      } else if (minPrice) {
        query.price = { $gte: parseInt(minPrice) };
      } else if (maxPrice) {
        query.price = { $lte: parseInt(maxPrice) };
      }
    }
    if (name) {
      let regexName = new RegExp(name, 'i');
      query['name'] = { $regex: regexName };
    }
    if (availability) query.availability = availability;

    const properties = await Property.find(query);
    res.status(200).json({
      data: properties,
      statusCode: 200,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      statusCode: 500,
      error: error.message
    });
  }
};

exports.createProperty = async (req, res) => {
  const { name, price, location, availability, amenities, admin } = req.body;
  console.log("jjghj",req)
  console.log("kfjkjdfjk",req.file)
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required.' });
  }

  try {
    const property = new Property({
      name,
      price: parseFloat(price),
      location,
      availability: availability === 'true',
      amenities: amenities ? amenities.split(',').map(amenity => amenity.trim()) : [],
      admin,
      image: req.file.path.replace(/\\/g, '/'), // Store the file path of the uploaded image
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({ message: 'Error creating property', error });
  }
};
exports.updateProperty = async (req, res) => {
  try {
    console.log("UPdate path")
    const { id } = req.params;
    const { name, price, location, amenities } = req.body;

    // Find the existing property to get its current image
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        data: null,
        statusCode: 404,
        error: 'Property not found',
      });
    }

    // If a new image file is uploaded
    if (req.file) {
      // Delete the old image if it exists
      const oldImagePath = path.join(__dirname, '..', property.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Remove the old image from the uploads directory
      }

      // Update the image with the new file
      property.image = `uploads/${req.file.filename}`;
    }

    // Update other property fields
    property.name = name || property.name;
    property.price = price || property.price;
    property.location = location || property.location;
    property.amenities = amenities || property.amenities;

    // Save the updated property
    const updatedProperty = await property.save();

    res.status(200).json({
      data: updatedProperty,
      statusCode: 200,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      statusCode: 500,
      error: error.message,
    });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(204).json({
      data: null,
      statusCode: 204,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      statusCode: 500,
      error: error.message
    });
  }
};
