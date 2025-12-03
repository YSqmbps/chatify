import express from 'express';
import {signup, login, logout} from '../controllers/auth.controller.js';

const router = express.Router();

// 注册路由
router.post('/signup',signup);

// 登录路由
router.post('/login', login);

// 注销路由
router.post('/logout', logout);


export default router;