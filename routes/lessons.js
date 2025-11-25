const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database'); 
const { ObjectId } = require('mongodb');

// GET /search - Search for lessons by topic or location
router.get('/search', async (req, res) => {
    try {
        const db = getDb();
        // Extract 'q' from the URL query string (e.g., /search?q=math)
        const { q } = req.query; 

        // Validate that a search term exists
        if (!q) {
            return res.status(400).json({ error: 'Query required' });
        }

        // Create a Regular Expression for case-insensitive matching ('i' flag)
        const queryRegex = new RegExp(q, 'i');

        // Search the 'lessons' collection
        // $or checks if EITHER the topic OR the location matches the regex
        const lessons = await db.collection('lessons').find({
            $or: [
                { topic: { $regex: queryRegex } },
                { location: { $regex: queryRegex } }
            ]
        }).toArray(); 

        res.status(200).json(lessons);
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: 'Search failed' });
    }
});

// GET / Retrieve all lessons
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        // Find({}) with an empty object selects all documents
        const lessons = await db.collection('lessons').find({}).toArray();
        res.status(200).json(lessons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch lessons' });
    }
});

// PUT /:id - Update the available space for a specific lesson
router.put('/:id', async (req, res) => {
    try {
        const db = getDb();
        const { space } = req.body; 
        
        // Simple validation: ensure space is a positive number
        if (typeof space !== 'number' || space < 0) {
            return res.status(400).json({ error: 'Invalid space value. Must be a non-negative number.' });
        }

        // Convert the string ID from the URL into a MongoDB ObjectId
        let objectId;
        try {
            objectId = new ObjectId(req.params.id);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid lesson ID format.' });
        }
        
        // Update the specific document
        // $set ensures we only change the 'space' field, leaving others alone
        const result = await db.collection('lessons').updateOne(
            { _id: objectId },
            { $set: { space: space } }
        );

        // Check if a document was actually found with that ID
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        res.status(200).json({ message: 'Lesson space updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not update lesson' });
    }
});

module.exports = router;