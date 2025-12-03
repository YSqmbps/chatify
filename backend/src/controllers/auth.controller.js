import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import { ENV } from '../lib/env.js';

export const signup = async (req, res) => {
  const {fullName,email, password} = req.body;
  try{
    // 验证输入
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: '所有字段都是必填项' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: '密码长度至少为6个字符' });
    }
    // 正则表达式验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: '邮箱格式无效' });
    }
    // 检查用户邮箱是否已存在
    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(400).json({ message: '邮箱已被注册' });
    } 
    // 哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword =  await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if(newUser) {
        // 保存用户到数据库
        const savedUser = await newUser.save();
        // 生成 JWT 令牌
        generateToken(newUser._id, res);
        // 返回用户信息（不包括密码）
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });

        // 发送欢迎邮件
        try {
            await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
        } catch (error) {
            console.error('发送欢迎邮件时出错:', error.message);
        }

    } else {
        res.status(400).json({ message: '用户创建失败' });
    }

  } catch(error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({ message: '服务器错误' });
  }
}