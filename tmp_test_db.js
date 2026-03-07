require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    console.log(users.map(u => ({ username: u.username, email: u.email })));
    process.exit(0);
}).catch(console.error);
