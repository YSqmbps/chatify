import Message from '../models/Message.js';
import User from '../models/User.js';
import cloudinary from '../lib/cloudinary.js';

export const getAllcontacts = async (req, res) => {
    try {
        const loggedInUSerId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUSerId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getAllcontacts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        // 从认证中间件 protectRoute 设置的 req.user 对象中获取用户 ID
        const myId = req.user._id;
        // 从URL参数中获取要聊天的用户 ID
        const {id:userToChatId} = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessagesByUserId:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        // 从请求体中获取消息文本和图片
        const { text,image } = req.body;
        // 从URL参数中获取接收者 ID
        const {id:receiverId} = req.params;
        // 从认证中间件 protectRoute 设置的 req.user 对象中获取发送者 ID
        const senderId = req.user._id;
        // 初始化图片 URL 为 null
        let imageUrl = null;
        if(image){
            // 上传图片到 Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            // 从 Cloudinary 上传响应中获取安全 URL
            imageUrl = uploadResponse.secure_url;
        }

        // 创建新消息对象
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        // 保存新消息到数据库
        await newMessage.save();

        // todo: 以后可以考虑使用 WebSocket 实时发送消息通知


        // 返回新创建的消息
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getchatPartners = async (req, res) => {
    try {
        const loggedInUSerId = req.user._id;
        // 查找所有与登录用户有消息记录的用户ID
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUSerId },
                { receiverId: loggedInUSerId },
            ],
        });
        // 提取所有唯一的聊天伙伴ID
        const chatPartnerIds = [
            // 过滤出与登录用户有消息记录的用户ID
            ...new Set(
                messages.map(msg => 
                    msg.senderId.toString() === loggedInUSerId.toString() 
                    ? msg.receiverId.toString() 
                    : msg.senderId.toString()
                )
            )
        ]; 
        // 以上逻辑的作用：
        // 遍历每条消息
        // 如果我是发送者 → 取接收者ID
        // 如果我是接收者 → 取发送者ID
        // 使用new Set()去除重复ID

        // 根据上一步得到的聊天伙伴ID列表，查找这些用户的详细信息
        const chatPartners = await User.find({
            _id: { $in: chatPartnerIds },
        }).select("-password");
        // 返回聊天伙伴列表
        res.status(200).json(chatPartners);

    } catch (error) {
        console.log("Error in getchatPartners:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}