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
        res.locals.isAdmin = user.role && user.role.name === 'admin';
      } else {
        req.user = null;
        res.locals.user = null;
        res.locals.isAdmin = false;
      }
    } catch (error) {
      console.error('Error attaching user to request:', error);
      req.user = null;
      res.locals.user = null;
      res.locals.isAdmin = false;
    }
  } else {
    req.user = null;
    res.locals.user = null;
    res.locals.isAdmin = false;
  }
  next();
};

export { attachUser };
export default authMiddleware;
