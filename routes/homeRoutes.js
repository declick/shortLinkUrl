import express from 'express';
import { getHome } from '../controllers/homeController.js';
import csrfProtection from '../middleware/csrfMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', { user: res.locals.user, csrfProtection, getHome});
});

export default router;
