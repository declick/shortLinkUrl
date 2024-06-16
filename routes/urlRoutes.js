import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createShortUrl, redirectToOriginalUrl } from '../controllers/urlController.js';
import csrfProtection from '../middleware/csrfMiddleware.js';

const router = express.Router();

router.get('/shorten', authMiddleware, csrfProtection, (req, res) => {
  res.render('shorten', { csrfToken: req.csrfToken(), user: req.user });
});

router.post('/shorten', authMiddleware, csrfProtection, createShortUrl);
router.get('/:shortUrl', redirectToOriginalUrl);

export default router;
