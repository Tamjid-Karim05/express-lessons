const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');
const { ObjectId } = require('mongodb');

router.get('/search', async (req, res) => {
    try {
        const db = getDb();
        const { q } = req.query; 

        if (!q) {
            return res.status(400).json({ error: 'Query required' });
        }

        const queryRegex = new RegExp(q, 'i');

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

router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const lessons = await db.collection('lessons').find({}).toArray();
        res.status(200).json(lessons);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch lessons' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const db = getDb();
        const { space } = req.body;
        
        if (typeof space !== 'number' || space < 0) {
            return res.status(400).json({ error: 'Invalid space value. Must be a non-negative number.' });
        }

        let objectId;
        try {
            objectId = new ObjectId(req.params.id);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid lesson ID format.' });
        }
        
        const result = await db.collection('lessons').updateOne(
            { _id: objectId },
            { $set: { space: space } }
        );

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