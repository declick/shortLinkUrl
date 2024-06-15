import User from '../models/User.js';
import Role from '../models/Role.js';
import ActivityLog from '../models/ActivityLog.js';

export const getAdminDashboard = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find().populate('role').sort({ createdAt: 'desc' }).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    const roles = await Role.find();

    res.render('adminDashboard', {
      users,
      roles,
      currentPage: page,
      totalPages,
      csrfToken: req.csrfToken(),
      user: req.user
    });
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

    // Log the activity
    const activityLog = new ActivityLog({
      user: req.user._id,
      action: `Updated role for user ${user.username} to ${role.name}`
    });
    await activityLog.save();

    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Error updating user role' });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    console.log('Received request to delete user with ID:', userId); // Log received userId
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId); // Log if user not found
      return res.status(404).json({ error: 'User not found' });
    }

    await User.findByIdAndDelete(userId);

    // Log the activity
    const activityLog = new ActivityLog({
      user: req.user._id,
      action: `Deleted user ${user.username}`
    });
    await activityLog.save();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

