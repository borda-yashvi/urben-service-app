import { Request, Response } from 'express';
import Business from '../models/Business';
import Payment from '../models/Payment';

export async function createBusiness(req: Request, res: Response) {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    // count active payments
    const activePayments = await Payment.countDocuments({ user: user._id, expiresAt: { $gt: new Date() } });
    const existingBusinesses = await Business.countDocuments({ owner: user._id });
    if (existingBusinesses >= activePayments) return res.status(400).json({ message: 'No remaining business slots. Purchase payment.' });
    const { name, details } = req.body;
    const b = await Business.create({ owner: user._id, name, details, status: 'active' });
    return res.json({ business: b });
}

export async function listBusiness(req: Request, res: Response) {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const q = {} as any;
    if (user.userType === 'business') q.owner = user._id;
    const bs = await Business.find(q);
    return res.json({ businesses: bs });
}

export async function getBusiness(req: Request, res: Response) {
    const { id } = req.params;
    const b = await Business.findById(id);
    if (!b) return res.status(404).json({ message: 'Not found' });
    return res.json({ business: b });
}

export async function updateBusiness(req: Request, res: Response) {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const b = await Business.findById(id);
    if (!b) return res.status(404).json({ message: 'Not found' });
    if (String(b.owner) !== String(user._id)) return res.status(403).json({ message: 'Forbidden' });
    const { name, details, status } = req.body;
    if (name) b.name = name;
    if (details) b.details = details;
    if (status) b.status = status;
    await b.save();
    return res.json({ business: b });
}

export async function deleteBusiness(req: Request, res: Response) {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const b = await Business.findById(id);
    if (!b) return res.status(404).json({ message: 'Not found' });
    if (String(b.owner) !== String(user._id)) return res.status(403).json({ message: 'Forbidden' });
    await b.deleteOne();
    return res.json({ message: 'Deleted' });
}
