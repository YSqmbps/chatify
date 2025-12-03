import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        // 从环境变量中获取 MONGO_URI, 并检查是否存在
        const {MONGO_URI} = ENV;
        if(!MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        // 连接到 MongoDB 数据库
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log('MongoDB connected successfully:', conn.connection.host);
    } catch (error) {
        // 打印连接错误信息并退出进程
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // 1 表示连接失败 0 表示连接成功
    }
}
