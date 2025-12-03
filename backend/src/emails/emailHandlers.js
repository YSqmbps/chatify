import {resendClient, sender} from '../lib/resend.js';
import { createWelcomeEmailTemplate } from '../emails/emailTemplates.js';

export const sendWelcomeEmail = async (email, name, clientURL) => {
    const { data , error } = await resendClient.emails.send({
        from: "onboarding@resend.dev",
        to: "ys965483569@gmail.com",
        subject: '欢迎加入 Chatify ！',
        html: createWelcomeEmailTemplate(name, clientURL),
    });

    if(error) {
        console.error('Error sending welcome email:', error);
        throw new Error('无法发送欢迎邮件');
    }

    console.log('Welcome email sent successfully:', data);
}