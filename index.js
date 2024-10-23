// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes=require('./routes/paymentRoutes')
const cors = require('cors');
const app = express();
app.use(cors())
app.use(express.json());
app.use('/uploads', express.static('uploads'));
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment',paymentRoutes );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
