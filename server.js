const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectToDb } = require('./db/database');

// Import Middleware
const logger = require('./middleware/logger');

// Import Routes
const lessonsRouter = require('./routes/lessons');
const ordersRouter = require('./routes/orders');

const app = express();

 
app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/images', (req, res, next) => {
    const filePath = path.join(__dirname, 'public', 'images', req.url);
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ message: 'Image not found' });
        }
        next();
    });
});
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use('/lessons', lessonsRouter);
app.use('/orders', ordersRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Lesson Shop Backend!');
});

// Start the server
const port = process.env.PORT || 8080; 

connectToDb().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at: http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
});