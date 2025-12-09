import express from "express";
import {
  getAllcontacts,
  getchatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();
// 所有路由都需要先通过 Arcjet 防护和认证中间件
// 这样可以确保所有请求都被 Arcjet 防护，并且只有认证通过的用户才能访问这些路由
router.use(arcjetProtection,protectRoute);

// 获取所有联系人
router.get("/contacts", getAllcontacts);
// 获取所有聊天联系人
router.get("/chats", getchatPartners);
// 获取所有聊天记录
router.get("/:id", getMessagesByUserId);
// 发送消息
router.post("/send/:id", sendMessage);

export default router;
