import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Device from '../models/Device';
import Payment from '../models/Payment';
import { sendResetEmail } from '../utils/email';

function signToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
}

export async function signup(req: Request, res: Response) {
    const { name, email, password, userType, company_brand, company_device, company_model, device_id, app_version } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, userType });
    await Device.create({ user: user._id, company_brand, company_device, company_model, device_id, app_version });
    const token = signToken(user._id.toString());
    return res.json({ token, user });
}

export async function login(req: Request, res: Response) {
    const { email, password, company_brand, company_device, company_model, device_id, app_version } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    // upsert device
    await Device.findOneAndUpdate({ user: user._id, device_id }, { company_brand, company_device, company_model, app_version, lastActive: new Date() }, { upsert: true, new: true });
    const token = signToken(user._id.toString());
    return res.json({ token, user });
}

export async function logout(req: Request, res: Response) {
    const user = req.user;
    const { device_id } = req.body;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!device_id) return res.status(400).json({ message: 'device_id required' });
    await Device.findOneAndDelete({ user: user._id, device_id });
    return res.json({ message: 'Logged out' });
}

export async function forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If account exists, reset token sent' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = otp;
    user.resetExpires = new Date(Date.now() + Number(process.env.RESET_TOKEN_EXPIRES || 3600000));
    await user.save();
    try {
        await sendResetEmail(user.email, otp);
    } catch (err) {
        console.error('Email send failed', err);
    }
    return res.json({ message: 'Reset OTP generated and emailed if configured' });
}

export async function resetPassword(req: Request, res: Response) {
    const { otp, password } = req.body as { otp: string; password: string };
    const user = await User.findOne({ resetToken: otp, resetExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.password = password;
    user.resetToken = undefined as any;
    user.resetExpires = undefined as any;
    await user.save();
    return res.json({ message: 'Password reset' });
}

export async function createPayment(req: Request, res: Response) {
    // helper endpoint to create a payment for testing (admin/business)
    const { amount, expiresInDays } = req.body;
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const expiresAt = new Date(Date.now() + (Number(expiresInDays || 30) * 24 * 60 * 60 * 1000));
    const p = await Payment.create({ user: user._id, amount: Number(amount || 0), expiresAt });
    return res.json({ payment: p });
}
