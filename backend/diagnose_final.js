const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('./models/Project');
const ProjectApplication = require('./models/ProjectApplication');
const User = require('./models/User');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected");
        
        const projects = await Project.find({}).lean();
        console.log(`\n--- ALL PROJECTS (${projects.length}) ---`);
        for (const p of projects) {
            const appsCount = await ProjectApplication.countDocuments({ projectId: p._id });
            console.log(`Title: ${p.title}`);
            console.log(`ID: ${p._id}`);
            console.log(`ContractorID: ${p.contractor ? p.contractor : 'MISSING'}`);
            console.log(`Applications: ${appsCount}`);
            console.log('------------------');
        }
        
        const apps = await ProjectApplication.find({}).lean();
        console.log(`\n--- ALL APPLICATIONS (${apps.length}) ---`);
        for (const a of apps) {
            console.log(`AppID: ${a._id}, ProjectID: ${a.projectId}, Status: ${a.status}`);
        }
    } catch (e) {
        console.error("DIAGNOSE ERROR:", e);
    } finally {
        await mongoose.disconnect();
    }
}
run();
