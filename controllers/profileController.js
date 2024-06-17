import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const getProfile = (req, res) => {
  res.render('profile', { user: req.user, csrfToken: req.csrfToken(), errorMessage: '' });
};

export const updateProfile = async (req, res) => {
  const { username, password, currentPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (password && (password !== confirmPassword)) {
      return res.render('profile', {
        user: req.user,
        csrfToken: req.csrfToken(),
        errorMessage: 'Passwords do not match.'
      });
    }

    if (password && !(await bcrypt.compare(currentPassword, user.password))) {
      return res.render('profile', {
        user: req.user,
        csrfToken: req.csrfToken(),
        errorMessage: 'Current password is incorrect.'
      });
    }

    user.username = username;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.clearCookie('token');
    res.redirect('/');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.render('profile', {
      user: req.user,
      csrfToken: req.csrfToken(),
      errorMessage: 'Error updating profile. Please try again.'
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.clearCookie('token');
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Error deleting profile' });
  }
};
