import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import { updateProfile, getProfile, listDevices } from '../controllers/userController';
import { validateBody } from '../middleware/validate';
import { updateUserSchema } from '../validators/user';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/me', requireAuth, getProfile);
router.put('/me', requireAuth, upload.single('profilePic'), validateBody(updateUserSchema), updateProfile);
router.get('/devices', requireAuth, listDevices);

export default router;
