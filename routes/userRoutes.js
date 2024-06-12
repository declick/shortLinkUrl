import express from 'express';
import { dashboard } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, dashboard);

export default router;
