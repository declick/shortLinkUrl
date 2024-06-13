import express from 'express';
import { getHome } from '../controllers/homeController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', { user: res.locals.user });
});

export default router;
