const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment from the backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

const Project = require('./models/Project');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/worksetu';

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await Project.updateMany(
            {}, 
            { $set: { isPublicPost: true } }
        );

        console.log(`Successfully migrated ${result.modifiedCount} projects to Public.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
