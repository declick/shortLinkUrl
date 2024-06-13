import { expressjwt as jwt } from 'express-jwt';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const authMiddleware = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.token,
  requestProperty: 'user',
});

export const handleJwtError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.redirect('/');
  }
  next(err);
};

export default authMiddleware;
