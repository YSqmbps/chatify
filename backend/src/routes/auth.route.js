import express from 'express';
import {signup} from '../controllers/auth.controller.js';

const router = express.Router();

// 注册路由
router.post('/signup',signup);
// 注册路由
router.get('/login', (req, res) => {
  res.send('login route');
});

export default router;