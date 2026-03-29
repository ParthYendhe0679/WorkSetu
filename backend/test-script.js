require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Project = require('./models/Project');
        const p = await Project.findById('69c83fb7e116eef1c837b6aa');
        
        console.log("=== Mongoose Document ===");
        if (p) {
            console.log("p.contractor === Object.contractor?", p.contractor === Object.contractor);
            console.log("p._doc['contractor']:", p._doc['contractor']);
            
        } else {
            console.log("Project not found");
        }

        const nativeP = await mongoose.connection.db.collection('projects').findOne({_id: new mongoose.Types.ObjectId('69c83fb7e116eef1c837b6aa')});
        console.log("=== Native MongoDB Document ===");
        if (nativeP) {
            console.log("nativeP keys:", Object.keys(nativeP));
            console.log("nativeP own contractor property:", Object.getOwnPropertyDescriptor(nativeP, 'contractor')?.value);
        }

        process.exit();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

test();
