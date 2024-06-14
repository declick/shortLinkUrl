import express from 'express';
import authMiddleware, { attachUser } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import csrfProtection from '../middleware/csrfMiddleware.js';
import { getAdminDashboard, updateUserRole, deleteUser } from '../controllers/adminController.js';

const router = express.Router();

router.use(authMiddleware);
router.use(attachUser);

router.get('/admin', adminMiddleware, csrfProtection, getAdminDashboard);
router.post('/admin/update-role', adminMiddleware, csrfProtection, updateUserRole);
router.post('/admin/delete-user', adminMiddleware, csrfProtection, deleteUser);

export default router;
