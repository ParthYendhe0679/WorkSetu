const mongoose = require('mongoose');
require('dotenv').config();
const ProjectApplication = require('./models/ProjectApplication');

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const apps = await ProjectApplication.find({});
        console.log("Total Applications:", apps.length);
        if(apps.length > 0) {
            console.log("First application projectId:", apps[0].projectId);
            console.log("First application status:", apps[0].status);
            console.log("First application workerId:", apps[0].workerId);
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit(0);
    }
}
test();
