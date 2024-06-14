import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import csrfProtection from '../middleware/csrfMiddleware.js';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profileController.js';

const router = express.Router();

router.get('/profile', authMiddleware, csrfProtection, getProfile);
router.post('/profile', authMiddleware, csrfProtection, updateProfile);
router.delete('/profile', authMiddleware, csrfProtection, deleteProfile);

export default router;
