
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';


import userRoutes from './routes/userRoutes.js';
import taskerRoutes from './routes/taskerRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import debugRoutes from './routes/debugRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
// Parse application/x-www-form-urlencoded (for form data)
app.use(express.urlencoded({ extended: true }));
// Parse application/json (for JSON bodies)
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'HomeServo Backend API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('/api/users', userRoutes);
app.use('/api/taskers', taskerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/debug', debugRoutes);

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log('Unmatched route:', req.method, req.originalUrl);
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    url: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
