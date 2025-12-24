
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

async function testConnection() {
    try {
        // Dynamic import to ensure env vars are set first
        const { default: connectDB } = await import('../lib/db');
        
        console.log('Attempting to connect to MongoDB...');
        await connectDB();
        console.log('✅ MongoDB connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
}

testConnection();
