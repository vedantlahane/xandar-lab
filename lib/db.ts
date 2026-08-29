import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache{
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose>  | null;
}

declare global{
    var mongoose : MongooseCache;
}


let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = { conn: null, promise: null};
}


/**
 * Connects to the MongoDB database using Mongoose. If a connection is already established, it returns the existing connection. If not, it creates a new connection and caches it for future use.
 * @returns {Promise<typeof mongoose>} A promise that resolves to the Mongoose connection.
 * @throws {Error} If there is an error connecting to the database.
 */
async function connectDB(){
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            socketTimeoutMS: 10000,
        }

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log("MongoDB Connected Successfully");
            return mongoose;
        }).catch(err => {
            console.error("MongoDB Connection Error:", err);
            cached.promise = null;
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
mongoose.connection.on("Connected",()=>{
    console.log("MongoDB connected");
})
export default connectDB;

