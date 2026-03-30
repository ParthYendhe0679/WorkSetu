const mongoose = require('mongoose');
const { getCoordinatesFromAddress } = require('./utils/geocoder');
const Project = require('./models/Project');
const User = require('./models/User');
require('dotenv').config();

async function verify() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        
        const contractor = await User.findOne({ role: 'contractor' });
        if (!contractor) {
            console.log("No contractor found. Using a random user.");
            var user = await User.findOne();
            if (!user) {
                console.log("No users found at all.");
                process.exit();
            }
        } else {
            var user = contractor;
        }

        const address = "Gateway of India, Mumbai";
        console.log(`\n--- Testing with address: "${address}" ---\n`);

        // Mimic controller logic
        let locationData = { address };
        const coords = await getCoordinatesFromAddress(address);
        if (coords) {
            locationData.type = 'Point';
            locationData.coordinates = coords;
        }

        const projectData = {
            title: "Geocoded Project Verification",
            description: "Testing if the backend automatically fetches coordinates from a manual address string.",
            requiredSkills: ["Testing", "Geocoding"],
            location: locationData,
            duration: "1 Week",
            totalWorkers: 1,
            totalDays: 7,
            wagePerDay: 800,
            createdBy: user._id,
            isPublicPost: true
        };

        const project = await Project.create(projectData);

        console.log("\n✅ Project Document Created in Database!");
        console.log("-----------------------------------------");
        console.log(`ID: ${project._id}`);
        console.log(`Address: ${project.location.address}`);
        console.log(`Coordinates: ${JSON.stringify(project.location.coordinates)}`);
        
        if (project.location.coordinates && project.location.coordinates.length === 2) {
            console.log("\n🚀 VERIFICATION SUCCESSFUL: Latitude and Longitude were automatically populated!");
        } else {
            console.log("\n❌ VERIFICATION FAILED: Coordinates are missing.");
        }
        
    } catch (err) {
        console.error("\n❌ Error during verification:", err.message);
    } finally {
        await mongoose.connection.close();
        console.log("\nDisconnected from MongoDB.");
    }
}

verify();
