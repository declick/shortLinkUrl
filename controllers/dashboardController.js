import Url from '../models/Url.js';
import { getTotalClicks, getBestShortlink } from './analyticsController.js';
import  io  from '../app.js';

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

export const getDashboard = async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1; // page par défaut à 1
  const limit = 4; // 4 URLs par page
  const skip = (page - 1) * limit;

  try {
    const urls = await Url.find({ userId }).skip(skip).limit(limit).sort({ createdAt: 'desc' });
    const totalUrls = await Url.countDocuments({ userId });
    const totalPages = Math.ceil(totalUrls / limit);

    const totalClicks = await getTotalClicks();
    const bestShortlink = await getBestShortlink();

    // Calcul des statistiques pour chaque URL
    let averageDailyClicks = 0;
    let averageWeeklyClicks = 0;
    let averageMonthlyClicks = 0;

    for (const url of urls) {
      const stats = calculateStatistics(url);
      averageDailyClicks += parseFloat(stats.averageDailyClicks);
      averageWeeklyClicks += parseFloat(stats.averageWeeklyClicks);
      averageMonthlyClicks += parseFloat(stats.averageMonthlyClicks);
    }

    averageDailyClicks = (averageDailyClicks / urls.length).toFixed(2);
    averageWeeklyClicks = (averageWeeklyClicks / urls.length).toFixed(2);
    averageMonthlyClicks = (averageMonthlyClicks / urls.length).toFixed(2);

    res.render('dashboard', {
      urls,
      currentPage: page,
      totalPages,
      csrfToken: req.csrfToken(),
      user: req.user,
      req,
      totalClicks: totalClicks || 0,
      bestShortlink: bestShortlink ? bestShortlink.shortUrl : '',
      bestShortlinkClicks: bestShortlink ? bestShortlink.clicks.length : 0,
      averageDailyClicks,
      averageWeeklyClicks,
      averageMonthlyClicks,
    });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Error fetching URLs' });
  }
};

export const deleteShortUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOneAndDelete({ shortUrl, userId: req.user.userId });

    if (!url) {
      return res.status(404).json({ error: 'URL not found or not authorized' });
    }

    io.emit('urlDeleted', { shortUrl: url.shortUrl });

    res.status(200).json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Error deleting URL' });
  }
};
