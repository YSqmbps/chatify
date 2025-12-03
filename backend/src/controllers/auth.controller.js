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

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        // 验证输入
        if (!email || !password) {
            return res.status(400).json({ message: '所有字段都是必填项' });
        }
        // 查找用户 
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:'无效的凭证 '});
        // 比较密码
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect)  return res.status(400).json({message:'无效的凭证 '});
        // 生成 JWT 令牌
        generateToken(user._id, res);
        // 返回用户信息（不包括密码）
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
        
    }
    catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ message: '服务器错误' });
    }
}

export const logout = (_, res) => {
    res.cookie("jwt","",{ maxAge: 0 });
    res.status(200).json({ message: '退出成功' });
}

export const updateProfile = async (req, res) => {
    try {
        // 
        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({ message: 'Profile picture is required' });

        // 从请求中获取用户 ID
        const userId = req.user._id;

        // 上传图片到 Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        // 更新用户的 profilePic 字段
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true } 
        );
        // 返回更新后的用户信息
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile controller: ", error.message);
        res.status(500).json({ message: '服务器错误' });
    }

}