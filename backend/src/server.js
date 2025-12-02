import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

// 生产环境部署的配置 
if(process.env.NODE_ENV === 'production') {
  // 静态资源服务
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  
  // 处理所有未匹配的路由，返回前端应用的入口文件
  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
