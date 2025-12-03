import express from 'express';
import {signup, login, logout, updateProfile} from '../controllers/auth.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

// 注册路由
router.post('/signup',signup);

// 登录路由
router.post('/login', login);

// 注销路由
router.post('/logout', logout);

// 更新用户信息路由
router.put('/update-profile', protectRoute, updateProfile); 

router.get('/check',protectRoute, (req, res) => res.status(200).json({ message: '已通过认证', user: req.user }));

export default router;