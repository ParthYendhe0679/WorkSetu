const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const jobsCollection = db.collection('jobs');

        // Find all jobs where location is a string (legacy)
        const legacyJobs = await jobsCollection.find({ location: { $type: 'string' } }).toArray();
        console.log(`Found ${legacyJobs.length} legacy jobs`);

        for (const job of legacyJobs) {
            const newLocation = {
                type: 'Point',
                coordinates: [73.8567, 18.5204], // Default to Pune [lng, lat]
                address: job.location || 'Pune, Maharashtra'
            };
            await jobsCollection.updateOne(
                { _id: job._id },
                { $set: { location: newLocation } }
            );
            console.log(`Updated job ${job._id}`);
        }

        // Also check if any jobs have the old location object structure (it might have changed)
        // or if coordinates are missing.
        const malformedJobs = await jobsCollection.find({ 
            $or: [
                { "location.coordinates": { $exists: false } },
                { "location.type": { $ne: "Point" } }
            ]
        }).toArray();
        
        console.log(`Found ${malformedJobs.length} malformed jobs`);
        for (const job of malformedJobs) {
            if (typeof job.location === 'string') continue; // Handled above
            
            const lat = job.location?.lat || 18.5204;
            const lng = job.location?.lng || 73.8567;
            const addr = job.location?.address || 'Unknown';
            
            await jobsCollection.updateOne(
                { _id: job._id },
                { $set: { 
                    location: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                        address: addr
                    }
                }}
            );
            console.log(`Fixed malformed job ${job._id}`);
        }

        console.log('Migration complete');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

fixDatabase();
