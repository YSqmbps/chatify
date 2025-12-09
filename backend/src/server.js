import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import { ENV } from './lib/env.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {connectDB} from './lib/db.js';




const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

// 中间件解析 JSON 请求体
app.use(express.json());
// 中间件解析 Cookie
app.use(cookieParser());

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
