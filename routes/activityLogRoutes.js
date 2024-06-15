// routes/activityLogRoutes.js

import express from 'express';
import authMiddleware, { attachUser } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import csrfProtection from '../middleware/csrfMiddleware.js';
import { getActivityLog } from '../controllers/activityLogController.js';

const router = express.Router();

router.use(authMiddleware);
router.use(attachUser);

router.get('/activity-log', adminMiddleware, csrfProtection, getActivityLog);

export default router;
