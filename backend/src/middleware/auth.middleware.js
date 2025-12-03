import jwt from 'jsonwebtoken';
import {ENV} from '../lib/env.js';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    try {
        // 从 Cookie 中获取 JWT 令牌
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({ message: '未授权访问-没有提供JWT令牌' });

        // 验证令牌
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded) return res.status(401).json({ message: '未授权访问-无效的JWT令牌' });

        // 从数据库中获取用户信息
        const user = await User.findById(decoded.userId);
        if(!user) return res.status(404).json({ message: '没有找到该用户' });

        // 将用户信息挂载到请求对象上
        req.user = user;
        next();
    } catch (error) {
        console.error('认证中间件出错:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
}