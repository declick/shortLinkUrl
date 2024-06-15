// routes/pricingRoute.js
import express from 'express';
import csrfProtection from '../middleware/csrfMiddleware.js';

const router = express.Router();

router.get('/pricing', csrfProtection, (req, res) => {
  res.render('pricing', { csrfToken: req.csrfToken(), user: req.user });
});

export default router;
