const mongoose = require('mongoose');
require('dotenv').config();
const Project = require('./models/Project');
const ProjectApplication = require('./models/ProjectApplication');

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const projects = await Project.find({});
        console.log("Projects found:", projects.length);
        
        for (const project of projects) {
            const apps = await ProjectApplication.find({ projectId: project._id });
            console.log(`Project: ${project.title} (${project._id})`);
            console.log(`  Contractor: ${project.get('contractor')}`);
            console.log(`  Applications count: ${apps.length}`);
            if (apps.length > 0) {
                console.log(`  Applications statuses: ${apps.map(a => a.status).join(', ')}`);
            }
        }
    } catch (e) {
        console.error("Test Error:", e);
    } finally {
        process.exit(0);
    }
}
test();
