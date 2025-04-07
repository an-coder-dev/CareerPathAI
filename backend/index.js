const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import Routes
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

// Database Connection
require('./Models/db');

// Initialize Express App
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://deploy-mern-app-1.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(bodyParser.json());

// Health Check API
app.get('/ping', (req, res) => {
    res.send('PONG ✅');
});

// Routes
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Server Listening
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
