require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testSignIn() {
    await mongoose.connect(process.env.MONGODB_URI);

    // Simulate user from Google
    const user = { email: 'vedantanillahane@gmail.com', name: 'Vedant Lahane' };

    // Mongoose safely checks if auth/google user exists
    const User = require('./.next/server/app/api/auth/[...nextauth]/route.js').default || mongoose.connection.db.collection('users');
    let dbUser = await mongoose.connection.db.collection('users').findOne({ email: user.email });
    console.log("Found db user:", !!dbUser);

    if (!dbUser) {
        console.log("No user found. Creating...");
        const baseUsername = user.name?.replace(/\s+/g, '').toLowerCase() || `user_${Date.now()}`;
        let username = baseUsername;
        console.log("Username generated:", username);
    }

    process.exit(0);
}

testSignIn().catch(console.error);
