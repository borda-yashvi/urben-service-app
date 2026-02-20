import mongoose from 'mongoose';

export default async function dbConnect() {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/urben';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
}
