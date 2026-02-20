import 'dotenv/config';
import express from 'express';

import dbConnect from './config/db';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import businessRoutes from './routes/business';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/business', businessRoutes);

// Connect to DB; in serverless environments this is safe to call on cold start
dbConnect().catch(err => console.error('DB connect error', err));

export default app;
