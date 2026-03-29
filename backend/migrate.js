require('dotenv').config();
const mongoose = require('mongoose');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Project = require('./models/Project');
        const User = require('./models/User');
        
        const batman = await User.findOne({name: 'Batman'});
        if (!batman) {
            console.log("No Batman user found.");
            process.exit(1);
        }

        const res = await mongoose.connection.db.collection('projects').updateMany(
            { createdBy: { $exists: false } },
            { $set: { createdBy: batman._id } }
        );

        console.log(`Migrated ${res.modifiedCount} projects to createdBy = ${batman._id}`);
        process.exit();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
