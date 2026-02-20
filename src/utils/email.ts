import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const port = Number(process.env.SMTP_PORT || 465);
const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true;

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!user || !pass) {
    console.warn('SMTP_USER or SMTP_PASS not set; emails will fail until configured');
}

const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
        user: user,
        pass: pass
    }
});

export async function sendResetEmail(to: string, token: string) {
    const frontUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontUrl}/reset-password?token=${token}`;
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || user,
        to,
        subject: 'Password reset',
        text: `You requested a password reset. Use this token or visit ${resetLink}. Token: ${token}`,
        html: `<p>You requested a password reset.</p><p>Click <a href="${resetLink}">here</a> to reset your password.</p><p>Or use this token: <code>${token}</code></p>`
    });
    return info;
}

export default transporter;
