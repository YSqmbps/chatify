import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

import { ENV } from './lib/env.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {connectDB} from './lib/db.js';

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

// 增加文件上传大小限制
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 中间件解析 Cookie
app.use(cookieParser());

// 改进CORS配置
app.use(cors({
  origin: ENV.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 处理预检请求
app.options('*', cors());

// 使用认证路由
app.use('/api/auth', authRoutes);
// 使用消息路由
app.use('/api/messages', messageRoutes);

// 生产环境部署的配置 
if(ENV.NODE_ENV === 'production') {
  // 静态资源服务
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  
  // 处理所有未匹配的路由，返回前端应用的入口文件
  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});