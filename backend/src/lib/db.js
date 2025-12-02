import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully:', conn.connection.host);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // 1 表示连接失败 0 表示连接成功
    }
}
