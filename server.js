const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectToDb } = require('./db/database');

// Import Middleware
const logger = require('./middleware/logger');

// Import Route handlers
const lessonsRouter = require('./routes/lessons');
const ordersRouter = require('./routes/orders');

const app = express();

// This allows your frontend (e.g., Vue.js running on port 8080) to talk to this backend
app.use(cors());

// Parse JSON 
app.use(express.json());

// Use our custom logger to print request details to the console
app.use(logger);

// Middleware to check if an image exists before trying to serve it
// This prevents the server from hanging
app.use('/images', (req, res, next) => {
    // Construct the absolute path to the requested file
    const filePath = path.join(__dirname, 'public', 'images', req.url);
    
    // Check file status
    fs.stat(filePath, (err, stats) => {
        // If error (file doesn't exist) 
        if (err || !stats.isFile()) {
            return res.status(404).json({ message: 'Image not found' });
        }
        // If file exists, proceed to the static handler below
        next();
    });
});

// Serve the actual files from the 'public/images' folder
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));


// --- ROUTES ---

// Mount the route files to specific paths
app.use('/lessons', lessonsRouter); // Handles all URLs starting with /lessons
app.use('/orders', ordersRouter);   // Handles all URLs starting with /orders

// Simple route to check if server is running
app.get('/', (req, res) => {
    res.send('Welcome to the Lesson Shop Backend!');
});


// --- SERVER STARTUP ---

// Use the PORT environment variable 8080
const port = process.env.PORT || 8080; 

// Connect to Database first
connectToDb().then(() => {
    // Only start the server if DB connection is successful
    app.listen(port, () => {
        console.log(`Server is running at: http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
});