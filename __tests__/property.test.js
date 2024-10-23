// __tests__/property.test.js

const request = require('supertest');
const app = require('../app'); // Your Express app
const mongoose = require('mongoose');
const Property = require('../models/propertyModel'); // Your Property model

beforeAll(async () => {
  // Connect to the test database (replace with your test DB URI)
  await mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Clean up and close the database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Property API', () => {
  it('should create a new property', async () => {
    const newProperty = {
      name: 'Test Property',
      price: 150000,
      location: 'Test Location',
      availability: true,
      amenities: ['Pool', 'Gym'],
      admin: 'adminId', // Replace with a valid admin ID if necessary
    };

    const response = await request(app)
      .post('/api/properties') // Adjust the route according to your setup
      .send(newProperty)
      .set('Authorization', 'Bearer your_jwt_token'); // Include a valid token for auth

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newProperty.name);
    expect(response.body.price).toBe(newProperty.price);
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/properties')
      .send({}) // Sending an empty object to simulate missing fields
      .set('Authorization', 'Bearer your_jwt_token');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Image file is required.'); // Adjust this according to your error message
  });
});
