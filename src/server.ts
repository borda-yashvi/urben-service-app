import 'dotenv/config';
import express from 'express';

import dbConnect from './config/db';
import businessCron from './jobs/businessCron';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import businessRoutes from './routes/business';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/business', businessRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
    await dbConnect();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    businessCron.start();
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});
