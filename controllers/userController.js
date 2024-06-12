import User from '../models/User.js';

export const dashboard = async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('dashboard', { user });
  } catch (error) {
    res.status(500).send('Server error');
  }
};
