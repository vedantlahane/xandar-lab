require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testMongooseCreate() {
    await mongoose.connect(process.env.MONGODB_URI);

    // The exact schema from User.ts (mocked minimally to test constraints)
    const UserSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, sparse: true },
        avatarGradient: { type: String, default: '' },
        role: { type: String, enum: ['user', 'pro', 'contributor', 'moderator', 'admin'], default: 'user' },
    }, { strict: false });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    try {
        const username = 'testgoogle' + Date.now();
        console.log("Attempting create with:", username);
        const dbUser = await User.create({
            username,
            email: 'vedantanillahane@gmail.com',
            avatarGradient: 'from-blue-500 to-cyan-500',
            role: 'user',
            savedProblems: [],
            completedProblems: [],
            savedJobs: [],
            isProfilePublic: false,
            reputationScore: 0,
            sessions: [],
        });
        console.log("Successfully created user!");

        // Output the created user
        console.log(dbUser.username);
    } catch (err) {
        console.error("MONGOOSE COLLISION OR ERROR:", err.message);
    }

    process.exit(0);
}

testMongooseCreate().catch(console.error);
