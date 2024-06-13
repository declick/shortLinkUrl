// controllers/homeController.js

export const getHome = (req, res) => {
  res.render('home', { user: req.user, csrfToken: req.csrfToken() });
};

