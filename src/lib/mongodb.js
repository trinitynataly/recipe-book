/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 12/04/2024
A helper function to connect to the MongoDB database.
*/

// Import the mongoose library for MongoDB connection
import mongoose from 'mongoose';

// Define the MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recepybook';

// Check if the MongoDB URI is defined
if (!MONGODB_URI) {
    // Throw an error if the MongoDB URI is not defined
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Define a global variable to store the MongoDB connection
let cached = global.mongooseConn;

// Check if the MongoDB connection is cached
if (!cached) {
    // Create a new MongoDB connection cache
    cached = global.mongooseConn = { conn: null, promise: null };
}

// Export the function to connect to the MongoDB database
async function dbConnect() {
    // Check if the MongoDB connection is already cached
    if (cached.conn) {
        // Return the cached connection
        return cached.conn;
    }

    // Check if the MongoDB connection promise is already cached
    if (!cached.promise) {
        // Define the MongoDB connection options
        const opts = {
            bufferCommands: false, // Disable mongoose buffering
        };

        // Create a new MongoDB connection promise
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            // Return the MongoDB connection
            return mongoose;
        });
    }
    // Wait for the MongoDB connection promise to resolve
    cached.conn = await cached.promise;
    // Return the MongoDB connection
    return cached.conn;
}

// Export the MongoDB connection function
export default dbConnect;
