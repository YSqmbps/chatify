import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

// Arcjet 中间件保护函数
export const arcjetProtection = async (req, res, next) => {
  try {
    // 保护请求
    const decision = await aj.protect(req);
    // 如果请求被拒绝，返回相应的错误响应
    if (decision.isDenied()) {
        // 如果是速率限制错误，返回 429 状态码
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "请求频率超过限制，请稍后重试。" });
      } else if (decision.reason.isBot()) {// 如果是机器人错误，返回 403 状态码
        return res.status(403).json({ message: " 机器人访问被拒绝。" });
      } else { 
        return res.status(403).json({
          message: "访问被 Arcjet 安全策略拒绝。",
        });
      }
    }

    // 检测伪装的机器人活动
    if (decision.results.some(isSpoofedBot)) {
        // 如果是伪装的机器人错误，返回 403 状态码
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "检测到恶意机器人活动。",
      });
    }

    next();
  } catch (error) {
    console.log("Arcjet Protection Error:", error);
    next();
  }
};