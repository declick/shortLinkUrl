// middleware/authMiddleware.js
import { expressjwt as jwt } from 'express-jwt';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const authMiddleware = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.token,
  requestProperty: 'user',
  credentialsRequired: false,
});

const attachUser = async (req, res, next) => {
  if (req.user) {
    try {
      const user = await User.findById(req.user.userId).populate('role');
      if (user) {
        req.user = user;
        res.locals.user = user;
      } else {
        req.user = null;
        res.locals.user = null;
      }
    } catch (error) {
      console.error('Error attaching user:', error);
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
};

export const handleJwtError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.redirect('/');
  }
  next(err);
};

export { attachUser };
export default authMiddleware;
