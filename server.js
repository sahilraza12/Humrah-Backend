import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js'; // 🚀 Added Banner Routes

// .env file configurations load kiye
dotenv.config();

// Database connect karne ka function call kiya
connectDB();

const app = express();

// Middlewares - Allow CORS & Large Payloads (50MB Limit for Base64 Images)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); // 🚀 Fixes Large Image Form Submissions

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/banners', bannerRoutes); // 🚀 Registered Banners API Endpoint

// Base Route
app.get('/', (req, res) => {
  res.send('Humrah Tour and Travel API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});