import User from '../models/User.js';
import Role from '../models/Role.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const users = await User.find().populate('role');
    const roles = await Role.find();
    res.render('adminDashboard', { users, roles, csrfToken: req.csrfToken(), user: req.user });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({ error: 'Error fetching admin dashboard data' });
  }
};

export const updateUserRole = async (req, res) => {
  const { userId, roleId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    user.role = role;
    await user.save();
    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Error updating user role' });
  }
};
