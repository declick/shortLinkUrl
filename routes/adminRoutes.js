import express from 'express';
import bodyParser from 'body-parser';
import authMiddleware, { attachUser } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import csrfProtection from '../middleware/csrfMiddleware.js';
import { getAdminDashboard, updateUserRole, deleteUser } from '../controllers/adminController.js';

const app = express();

const router = express.Router();

router.get('/admin', adminMiddleware, csrfProtection, getAdminDashboard);
router.post('/admin/update-role', adminMiddleware, csrfProtection, updateUserRole);
router.delete('/admin/delete-user', adminMiddleware, csrfProtection, deleteUser);

app.use(router);

export default app;
