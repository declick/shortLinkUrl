import Url from '../models/Url.js';

const calculateStatistics = (url) => {
  const clicks = url.clicks || [];
  const countryClicks = {};

  clicks.forEach(click => {
    const country = click.country || 'Unknown';
    if (countryClicks[country]) {
      countryClicks[country]++;
    } else {
      countryClicks[country] = 1;
    }
  });

  const totalClicks = clicks.length;
  const countryPercentages = {};

  for (const country in countryClicks) {
    countryPercentages[country] = ((countryClicks[country] / totalClicks) * 100).toFixed(2);
  }

  return { totalClicks, countryPercentages };
};

export const getAnalytics = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).send('URL not found');
    }

    const stats = calculateStatistics(url);

    res.render('analytics', {
      url,
      csrfToken: req.csrfToken(),
      user: req.user,
      clicksCount: stats.totalClicks,
      countryPercentages: stats.countryPercentages,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
};
