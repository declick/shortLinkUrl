import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import csrfProtection from '../middleware/csrfMiddleware.js';
import { createShortUrl, redirectToOriginalUrl } from '../controllers/urlController.js';

const router = express.Router();

router.get('/shorten', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.render('shorten', { csrfToken: req.csrfToken(), user: req.user, errorMessage: null });
});

router.post('/shorten', authMiddleware, csrfProtection, createShortUrl);
router.get('/:shortUrl', redirectToOriginalUrl);

export default router;
