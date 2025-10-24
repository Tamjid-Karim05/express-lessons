const { MongoClient } = require('mongodb');


const connectionString = 'mongodb+srv://Tamjid1:Riyadh18.@fullstacklessonshop.7yi6iqr.mongodb.net/?appName=FullStackLessonShop';

const client = new MongoClient(connectionString);

let db; 

// Function to connect to the database
async function connectToDb() {
    if (db) return db; 
    try {
        await client.connect();
        db = client.db('lesson-shop'); 
        console.log('Successfully connected to MongoDB Atlas');
        return db;
    } catch (err) {
        console.error('Failed to connect to MongoDB Atlas', err);
        process.exit(1); 
    }
}


const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized! Call connectToDb first.');
    }
    return db;
};

// Export the functions
module.exports = { connectToDb, getDb };