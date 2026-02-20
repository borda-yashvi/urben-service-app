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

export async function sendResetEmail(to: string, otp: string) {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || user,
        to,
        subject: 'Your password reset OTP',
        text: `Your password reset OTP is: ${otp}. It expires in ${Number(process.env.RESET_TOKEN_EXPIRES || 3600000) / 60000} minutes.`,
        html: `<p>Your password reset OTP is:</p><h2>${otp}</h2><p>It expires in ${Number(process.env.RESET_TOKEN_EXPIRES || 3600000) / 60000} minutes.</p>`
    });
    return info;
}

export default transporter;
