const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors'); // Import the CORS middleware
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Use CORS middleware to allow cross-origin requests
app.use(express.json()); // Middleware for parsing JSON requests

// MongoDB connection string. Replace with your actual connection string.
const uri = "mongodb+srv://Tamjid:Riyadh18.@tamjid.8a8qw.mongodb.net/?retryWrites=true&w=majority&appName=Tamjid"; 

// Database name
const dbName = "cw2"; 

let db;

async function connectToDb() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");
        db = client.db(dbName);
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

// Start the server only after a successful database connection
async function startServer() {
    await connectToDb();
    if (db) {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
}

startServer();

// REST API Routes
// GET route to fetch all lessons
app.get('/lessons', async (req, res) => {
    try {
        const lessons = await db.collection('lessons').find().toArray();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching lessons' });
    }
});

// POST route to save a new order
app.post('/orders', async (req, res) => {
    const { name, phoneNumber, lessonIds, numberOfSpaces } = req.body;
    
    if (!name || !phoneNumber || !lessonIds || !numberOfSpaces) {
        return res.status(400).json({ message: 'Missing order information' });
    }
    
    const order = { name, phoneNumber, lessonIds, numberOfSpaces, createdAt: new Date() };

    try {
        const result = await db.collection('orders').insertOne(order);
        res.status(201).json({ message: 'Order submitted successfully', orderId: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting order' });
    }
});

// PUT route to update lesson space
app.put('/lessons/:id', async (req, res) => {
    const { id } = req.params;
    const { space } = req.body;
    try {
        const result = await db.collection('lessons').updateOne(
            { _id: new ObjectId(id) },
            { $set: { space: space } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.json({ message: 'Lesson updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating lesson' });
    }
});

// Static file middleware for serving images from the public folder
app.use(express.static(path.join(__dirname, 'public')));