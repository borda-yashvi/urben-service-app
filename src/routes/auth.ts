import { Router } from 'express';
import multer from 'multer';
import { signup, login, logout, forgotPassword, resetPassword, createPayment } from '../controllers/authController';
import { validateBody } from '../middleware/validate';
import { signupSchema, loginSchema, forgotSchema, resetSchema, logoutSchema, paymentSchema } from '../validators/auth';
import { requireAuth } from '../middleware/auth';

const router = Router();
const upload = multer();

router.post('/signup', validateBody(signupSchema), signup);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', requireAuth, validateBody(logoutSchema), logout);
router.post('/forgot', validateBody(forgotSchema), forgotPassword);
router.post('/reset', validateBody(resetSchema), resetPassword);

// test helper: create payment
router.post('/payment', requireAuth, validateBody(paymentSchema), createPayment);

export default router;
