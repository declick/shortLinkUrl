import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getDashboard, deleteShortUrl } from '../controllers/dashboardController.js';
import csrfProtection from '../middleware/csrfMiddleware.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, csrfProtection, getDashboard);

router.delete('/dashboard/:shortUrl', authMiddleware, csrfProtection, deleteShortUrl);

export default router;
