const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Project = require('./models/Project');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    const p = await Project.findOne();
    if (!p) {
        console.log("No projects found");
        return process.exit(0);
    }
    console.log("Project title:", p.title);
    
    try {
        console.log("Contractor via _doc:", p._doc['contractor']?.toString());
    } catch(e) { console.error("Error accessing _doc contractor:", e); }
    
    process.exit(0);
}
test();
