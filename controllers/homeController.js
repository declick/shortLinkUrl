// controllers/homeController.js

export const getHome = (req, res) => {
  res.render('home', { user: req.user, isAdmin: req.user && req.user.role && req.user.role.name === 'admin' });
};