const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const connectionString = 'mongodb+srv://Tamjid1:Riyadh18.@fullstacklessonshop.7yi6iqr.mongodb.net/?appName=FullStackLessonShop';


const client = new MongoClient(connectionString);
let db;

async function seedDatabase(dbInstance) {
    try {
        const lessonsCollection = dbInstance.collection('lessons');
        const count = await lessonsCollection.countDocuments();

        if (count === 0) {
            console.log('No lessons found. Seeding database...');
            const lessonsJSON = fs.readFileSync(path.join(__dirname, '../data/lessons_sample.json'), 'utf-8');
            const lessonsData = JSON.parse(lessonsJSON);

            if (!lessonsData || lessonsData.length === 0) {
                console.error('Error: lessons_sample.json file is empty.');
                return;
            }

            const lessonsWithSpace = lessonsData.map(lesson => ({
                ...lesson,
                space: 5 // Default space
            }));

            await lessonsCollection.insertMany(lessonsWithSpace);
            console.log('Database seeded successfully with lessons!');
        } else {
            console.log('Database already contains lessons. Skipping seed.');
        }
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

async function connectToDb() {
    if (db) return db;
    try {
        await client.connect();
        db = client.db('lesson-shop'); 
        console.log('Successfully connected to MongoDB Atlas');
        await seedDatabase(db);
        return db;
    } catch (err) {
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