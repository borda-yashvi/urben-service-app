import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = schema.parse(req.body);
        return next();
    } catch (err: any) {
        return res.status(400).json({ errors: err.errors || err.message });
    }
};
