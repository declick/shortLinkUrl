import { expressjwt as jwt } from 'express-jwt';
import config from '../config/config.js';

const authMiddleware = jwt({
  secret: config.jwtSecret,
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
