import Url from '../models/Url.js';

export const getAnalytics = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).send('URL not found');
    }

    const clicks = url.clicks || [];

    res.render('analytics', {
      url,
      csrfToken: req.csrfToken(),
      user: req.user,
      clicksCount: clicks.length
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
};
