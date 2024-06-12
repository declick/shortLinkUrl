import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import csrfProtection from '../middleware/csrfMiddleware.js';

const router = express.Router();

router.get('/signup', csrfProtection, (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken(), errorMessage: null });
});

router.post('/register', csrfProtection, registerUser);

router.get('/login', csrfProtection, (req, res) => {
  res.render('login', { csrfToken: req.csrfToken(), errorMessage: null });
});

router.post('/login', csrfProtection, loginUser);

router.get('/logout', logoutUser);

export default router;
