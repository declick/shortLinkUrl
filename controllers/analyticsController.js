import Url from '../models/Url.js';

export const getAnalytics = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ shortUrl, userId: req.user.userId });

    if (!url) {
      return res.status(404).json({ error: 'URL not found or not authorized' });
    }

    res.render('analytics', { url, user: req.user, csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
};
