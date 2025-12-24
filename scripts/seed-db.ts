
import fs from 'fs';
import path from 'path';

// Load env vars from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const firstEqualIndex = line.indexOf('=');
        if (firstEqualIndex !== -1) {
            const key = line.substring(0, firstEqualIndex).trim();
            const value = line.substring(firstEqualIndex + 1).trim();
            if (key && value) {
                process.env[key] = value;
            }
        }
    });
} else {
    console.warn("Warning: .env.local file not found at", envPath);
}

async function seed() {
    try {
        // Dynamic imports to ensure env vars are loaded
        const { default: connectDB } = await import('../lib/db');
        const { default: Problem } = await import('../models/Problem');
        const { SHEET } = await import('../app/lab/practice/data/sheet');

        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('Connected. Starting seed...');

        let count = 0;
        for (const topic of SHEET) {
            for (const problem of topic.problems) {
                await Problem.findOneAndUpdate(
                    { id: problem.id },
                    { 
                        ...problem,
                        topicName: topic.topicName 
                    },
                    { upsert: true, new: true }
                );
                count++;
            }
        }

        console.log(`✅ Successfully seeded ${count} problems.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
