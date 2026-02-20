import cron from 'node-cron';
import Payment from '../models/Payment';
import Business from '../models/Business';

const task = cron.schedule(process.env.CRON_SCHEDULE || '0 0 2 * * *', async () => {
    console.log('Running business payment check cron');
    try {
        // For all businesses, check owner's active payments; if none, set inactive
        const businesses = await Business.find().populate('owner');
        for (const b of businesses) {
            const activePayments = await Payment.countDocuments({ user: (b as any).owner._id, expiresAt: { $gt: new Date() } });
            if (activePayments <= 0 && b.status === 'active') {
                b.status = 'inactive';
                await b.save();
            }
            if (activePayments > 0 && b.status === 'inactive') {
                b.status = 'active';
                await b.save();
            }
        }
    } catch (err) {
        console.error('Cron job error', err);
    }
}, { scheduled: false });

export default task;
