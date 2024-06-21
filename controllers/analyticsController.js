// controllers/analyticsController.js

import Url from '../models/Url.js';

const calculateStatistics = (url) => {
  const clicks = url.clicks || [];
  const countryClicks = {};

  const currentTime = new Date();
  let dailyClicks = 0;
  let weeklyClicks = 0;
  let monthlyClicks = 0;

  clicks.forEach(click => {
    const clickDate = new Date(click.timestamp);
    const timeDiff = currentTime - clickDate;

    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    if (daysDiff <= 1) {
      dailyClicks++;
    }
    if (daysDiff <= 7) {
      weeklyClicks++;
    }
    if (daysDiff <= 30) {
      monthlyClicks++;
    }

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

  const averageDailyClicks = (dailyClicks / 1).toFixed(2);
  const averageWeeklyClicks = (weeklyClicks / 7).toFixed(2);
  const averageMonthlyClicks = (monthlyClicks / 30).toFixed(2);

  return { totalClicks, countryPercentages, averageDailyClicks, averageWeeklyClicks, averageMonthlyClicks };
};

export const getAnalytics = async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
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
      averageDailyClicks: stats.averageDailyClicks,
      averageWeeklyClicks: stats.averageWeeklyClicks,
      averageMonthlyClicks: stats.averageMonthlyClicks,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
};

export const getTotalClicks = async () => {
  const urls = await Url.find();
  if (!urls || urls.length === 0) {
    return 0;
  }
  return urls.reduce((acc, url) => acc + (url.clicks ? url.clicks.length : 0), 0);
};

export const getBestShortlink = async () => {
  const urls = await Url.find();
  if (!urls || urls.length === 0) {
    return null;
  }
  return urls.reduce((max, url) => (url.clicks ? url.clicks.length : 0) > (max.clicks ? max.clicks.length : 0) ? url : max, urls[0]);
};
