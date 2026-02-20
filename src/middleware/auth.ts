import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
        const user = await User.findById(payload.id);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        req.user = user as any;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export function requireUserType(...allowed: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (!allowed.includes(req.user.userType)) return res.status(403).json({ message: 'Forbidden' });
        next();
    };
}
