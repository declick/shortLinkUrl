import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAnalytics } from '../controllers/analyticsController.js';
import csrfProtection from '../middleware/csrfMiddleware.js';

const router = express.Router();

router.get('/analytics/:shortUrl', authMiddleware, csrfProtection, getAnalytics);

export default router;
