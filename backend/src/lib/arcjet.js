import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

import { ENV } from "./env.js";

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    // 可保护你的应用免受常见攻击，例如 SQL 注入
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following 
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        //取消注释以允许这些其他常见的机器人类别
        //查看完整列表：https://arcjet.com/bot-list
        //“类别：监控”//正常运行时间监控服务
        //“类别：预览”//链接预览，例如Slack、Discord
      ],
    }),
    //创建令牌桶速率限制。也支持其他算法。
    slidingWindow({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      max: 100,
      interval: 60, // 每60秒允许100次请求
    }),
  ],
});

export default aj;
