import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    // 生成 JWT 令牌,7天后过期,用于用户身份验证和会话管理 
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    // 将令牌存储在 HTTP 仅 cookie 中，增强安全性
    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 毫秒
        httpOnly: true, // 仅通过 HTTP 协议访问，防止客户端脚本访问
        sameSite: 'strict', // 只允许在相同站点发送请求,防止 CSRF 攻击
        // 在开发环境下 http://localhost 不使用 HTTPS, 生产环境下 https://chatify.com 使用 HTTPS
        secure: process.env.NODE_ENV === 'development'? false : true, 
    });
    return token;
}
