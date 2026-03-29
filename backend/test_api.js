async function test() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'sharma@gmail.com', // Actually, I'll bypass this if I don't know the password...
                password: 'password123'
            })
        });
        const data = await loginRes.json();
        if (data.token) {
            console.log("Logged in!");
            const res = await fetch('http://localhost:5000/api/projects/69c862bf12739189a7c416b4/complete-day', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${data.token}` },
                body: JSON.stringify({ presentWorkerIds: ['65f123456789012345678901'] })
            });
            console.log(await res.json());
        } else {
            console.log("Login failed", data);
        }
    } catch(e) {
        console.error(e);
    }
}
test();
