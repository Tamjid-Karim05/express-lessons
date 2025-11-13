const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

router.post('/', async (req, res) => {
    try {
        const db = getDb();
        const newOrder = req.body;

        if (!newOrder.firstName || !newOrder.phoneNumber || !newOrder.items || !Array.isArray(newOrder.items) || newOrder.items.length === 0) {
            return res.status(400).json({ error: 'Invalid order data. Missing required fields.' });
        }

        const result = await db.collection('orders').insertOne(newOrder);
        res.status(201).json({ message: 'Order created successfully', orderId: result.insertedId });

    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Could not create order' });
    }
});

module.exports = router;