const { MongoClient } = require('mongodb');

// The connection string 
const connectionString = 'mongodb+srv://Tamjid1:Riyadh18.@fullstacklessonshop.7yi6iqr.mongodb.net/?appName=FullStackLessonShop';

const client = new MongoClient(connectionString);

// This prevents creating a new connection for every single request.
let db;

async function connectToDb() {
    // Check if we have already connected.
    if (db) return db;

    try {
        // Attempt to connect to the client
        await client.connect();

        // Select the specific database name ('lesson-shop')
        db = client.db('lesson-shop'); 

        console.log('Successfully connected to MongoDB Atlas');
        return db;
    } catch (err) {
        // Handle connection failures
        console.error('Failed to connect to MongoDB Atlas', err);
        
        process.exit(1); 
    }
}


const getDb = () => {
    if (!db) {
        throw new Error('Database not initialised! Call connectToDb first.');
    }
    return db;
};

module.exports = { connectToDb, getDb };