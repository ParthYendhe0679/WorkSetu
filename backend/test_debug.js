const mongoose = require('mongoose');
require('dotenv').config();
const Project = require('./models/Project');
const ProjectApplication = require('./models/ProjectApplication');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        
        const projects = await Project.find({});
        console.log(`Found ${projects.length} projects`);
        
        for (const p of projects) {
            const apps = await ProjectApplication.find({ projectId: p._id });
            console.log(`--- PROJECT: ${p.title} ---`);
            console.log(`ID: ${p._id}`);
            console.log(`Contractor: ${p.get('contractor') ? p.get('contractor').toString() : 'MISSING'}`);
            console.log(`Applications: ${apps.length}`);
            if (apps.length > 0) {
                apps.forEach(a => {
                    console.log(`  - App ID: ${a._id}, Worker ID: ${a.workerId}, Status: ${a.status}`);
                });
            }
        }
        
    } catch (err) {
        console.error("ERROR:", err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
