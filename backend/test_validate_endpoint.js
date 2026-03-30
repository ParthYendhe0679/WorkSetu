const fetch = require('node-fetch');
require('dotenv').config();

async function testValidation() {
    const url = 'http://localhost:5000/api/projects/validate-address';
    
    // Note: This requires the server to be running.
    // If the server is not running, we can test the controller function directly.
    
    console.log("Testing validateAddress controller logic directly (since server might not be running)...");
    const { validateAddress } = require('./controllers/projectController');
    
    // Mock req, res
    const req = {
        body: { address: "Mumbai, Maharashtra" },
        user: { id: "mock_user_id" }
    };
    const res = {
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            this.data = data;
            return this;
        }
    };

    try {
        await validateAddress(req, res);
        console.log("Status:", res.statusCode);
        console.log("Response:", JSON.stringify(res.data, null, 2));
        
        if (res.statusCode === 200 && res.data.success) {
            console.log("✅ Validation Endpoint Logic PASSED");
        } else {
            console.log("❌ Validation Endpoint Logic FAILED");
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

testValidation();
