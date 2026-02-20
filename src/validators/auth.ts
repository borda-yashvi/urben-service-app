import { z } from 'zod';

export const deviceSchema = z.object({
    company_brand: z.string().min(1),
    company_device: z.string().min(1),
    company_model: z.string().min(1),
    device_id: z.string().min(1),
    app_version: z.string().min(1)
});

export const signupSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    userType: z.enum(['business', 'customer', 'admin']),
}).merge(deviceSchema);

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
}).merge(deviceSchema);

export const forgotSchema = z.object({ email: z.string().email() });
export const resetSchema = z.object({ token: z.string(), password: z.string().min(6) });

export const logoutSchema = z.object({ device_id: z.string().min(1) });

export const paymentSchema = z.object({ amount: z.number().optional(), expiresInDays: z.number().optional() });
