import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const getProfile = (req, res) => {
  res.render('profile', { user: req.user, csrfToken: req.csrfToken(), errorMessage: null });
};

export const updateProfile = async (req, res) => {
  const { username, currentPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    // Vérifier si le mot de passe actuel est correct
    if (currentPassword && !(await bcrypt.compare(currentPassword, user.password))) {
      return res.render('profile', {
        user: req.user,
        csrfToken: req.csrfToken(),
        errorMessage: 'Current password is incorrect'
      });
    }

    // Vérifier si tous les champs de mot de passe sont remplis
    if (currentPassword && (!newPassword || !confirmNewPassword)) {
      return res.render('profile', {
        user: req.user,
        csrfToken: req.csrfToken(),
        errorMessage: 'Please fill in all password fields'
      });
    }

    // Vérifier si le nouveau mot de passe et la confirmation correspondent
    if (newPassword && newPassword !== confirmNewPassword) {
      return res.render('profile', {
        user: req.user,
        csrfToken: req.csrfToken(),
        errorMessage: 'New passwords do not match'
      });
    }

    user.username = username;

    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.clearCookie('token');
    res.redirect('/');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
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
