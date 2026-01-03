import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const URI = "mongodb+srv://rashmisachan47_db_user:dps8YaHl22B8Wg5Z@cluster0.nmaftgg.mongodb.net/?appName=Cluster0";
        const conn = await mongoose.connect(URI);
        console.log(`🚀 [GodX Backend] MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
