import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
    try {
        const url = process.env.MONGO_URI;
        if (!url) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        await mongoose.connect(url);
        console.log('MongoDB connected successfully');
    }
    catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};
export default connectDB;
