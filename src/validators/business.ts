import { z } from 'zod';

export const createBusinessSchema = z.object({
    name: z.string().min(1),
    details: z.string().optional(),
});

export const updateBusinessSchema = z.object({
    name: z.string().min(1).optional(),
    details: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional()
});
