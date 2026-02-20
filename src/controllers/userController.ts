import { Request, Response } from 'express';
import User from '../models/User';
import Device from '../models/Device';
import { uploadBufferAsImage } from '../utils/cloudinary';

export async function getProfile(req: Request, res: Response) {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    return res.json({ user });
}

export async function updateProfile(req: Request, res: Response) {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const { name } = req.body;
    const file = (req as any).file;
    if (file) {
        const url = await uploadBufferAsImage(file.buffer, file.originalname);
        user.profilePic = url;
    }
    if (name) user.name = name;
    await user.save();
    return res.json({ user });
}

export async function listDevices(req: Request, res: Response) {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const devices = await Device.find({ user: user._id });
    return res.json({ devices });
}
