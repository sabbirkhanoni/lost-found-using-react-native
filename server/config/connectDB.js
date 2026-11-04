// Initiate connection to the database using mongoose
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.warn("⚠️ Warning: MONGODB_URI is not defined in environment variables!");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('✅ Connected to MongoDB database successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message || error);
    }
}

export default connectDB;
