export const getHome = (req, res) => {
    res.render('home', { title: 'Home', user: req.user });
  };
  