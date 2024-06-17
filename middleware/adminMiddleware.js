// middleware/adminMiddleware.js


const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.name === 'admin') {
    next();
  } else {
    res.redirect('/');
  }
};

export default adminMiddleware;
