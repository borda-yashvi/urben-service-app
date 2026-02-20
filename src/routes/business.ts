import { Router } from 'express';
import { requireAuth, requireUserType } from '../middleware/auth';
import { createBusiness, listBusiness, getBusiness, updateBusiness, deleteBusiness } from '../controllers/businessController';
import { validateBody } from '../middleware/validate';
import { createBusinessSchema, updateBusinessSchema } from '../validators/business';

const router = Router();

router.use(requireAuth);

// Only business users can manage businesses
router.post('/', requireUserType('business'), validateBody(createBusinessSchema), createBusiness);
router.get('/', listBusiness);
router.get('/:id', getBusiness);
router.put('/:id', requireUserType('business'), validateBody(updateBusinessSchema), updateBusiness);
router.delete('/:id', requireUserType('business'), deleteBusiness);

export default router;
