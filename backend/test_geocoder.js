const { getCoordinatesFromAddress } = require('./utils/geocoder');

async function test() {
    const addresses = [
        "Gateway of India, Mumbai",
        "Pune Station",
        "1600 Amphitheatre Parkway, Mountain View, CA"
    ];

    for (const address of addresses) {
        console.log(`Testing: "${address}"`);
        const coords = await getCoordinatesFromAddress(address);
        if (coords) {
            console.log(`✅ Result: ${JSON.stringify(coords)}`);
        } else {
            console.log(`❌ Result: Failed`);
        }
        console.log('---');
    }
}

test();
