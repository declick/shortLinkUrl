// controllers/activityLogController.js

import ActivityLog from '../models/ActivityLog.js';

export const getActivityLog = async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const activities = await ActivityLog.find().populate('user').skip(skip).limit(limit).sort({ timestamp: -1 });
    const totalActivities = await ActivityLog.countDocuments();
    const totalPages = Math.ceil(totalActivities / limit);

    res.render('activityLog', {
      activities,
      currentPage: page,
      totalPages,
      csrfToken: req.csrfToken(),
      user: req.user
    });
  } catch (error) {
    console.error('Error fetching activity log data:', error);
    res.status(500).json({ error: 'Error fetching activity log data' });
  }
};
