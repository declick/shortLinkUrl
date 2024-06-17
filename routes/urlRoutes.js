// routes/urlRoutes.js

import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import csrfProtection from '../middleware/csrfMiddleware.js';
import { createShortUrl, redirectToOriginalUrl } from '../controllers/urlController.js';
import ensureAuthenticated  from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware appliqués dans l'ordre
router.get('/shorten', authMiddleware, ensureAuthenticated ,csrfProtection, (req, res) => {
  res.render('shorten', { csrfToken: req.csrfToken(), user: req.user });
});

// Routes pour les opérations correspondantes
router.post('/shorten', authMiddleware, ensureAuthenticated ,csrfProtection, createShortUrl);
router.get('/:shortUrl', redirectToOriginalUrl);


export default router;
