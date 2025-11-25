const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');
const { ObjectId } = require('mongodb'); 
router.post('/', async (req, res) => {
    try {
        const db = getDb();
        const newOrder = req.body;

        // Validate incoming data
        if (!newOrder.firstName || !newOrder.phoneNumber || !newOrder.items || !Array.isArray(newOrder.items) || newOrder.items.length === 0) {
            return res.status(400).json({ error: 'Invalid order data. Missing required fields.' });
        }

        // Save the order to the 'orders' collection
        const result = await db.collection('orders').insertOne(newOrder);

        // 3. UPDATE THE SPACES (This is the missing part)
        // We loop through every item in the order
        for (const item of newOrder.items) {
            
            // We find the lesson by ID and update it
            await db.collection('lessons').updateOne(
                { _id: new ObjectId(item.lessonId) }, 
                { 
                    
                    
                    $inc: { space: -item.quantity } 
                }
            );
        }

        res.status(201).json({ message: 'Order created and spaces updated', orderId: result.insertedId });

    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Could not create order' });
    }
});

module.exports = router;