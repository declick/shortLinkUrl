import { expressjwt as jwt } from 'express-jwt';
import config from '../config/config.js';

const authMiddleware = jwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.token,
  requestProperty: 'user',
});

export default authMiddleware;
