import shortid from 'shortid';
import Url from '../models/Url.js';
import io from '../app.js';
import geoip from 'geoip-lite';
import validator from 'validator';
import { getTotalClicks, getBestShortlink } from './analyticsController.js';

const calculateStatistics = (url) => {
  const clicks = url.clicks || [];
  const countryClicks = {};

  clicks.forEach(click => {
    const country = click.country || 'Unknown';
    countryClicks[country] = (countryClicks[country] || 0) + 1;
  });

  const totalClicks = clicks.length;
  const countryPercentages = {};

  for (const country in countryClicks) {
    countryPercentages[country] = ((countryClicks[country] / totalClicks) * 100).toFixed(2);
  }

  return { totalClicks, countryPercentages };
};

export const createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!validator.isURL(originalUrl)) {
    return res.render('shorten', {
      csrfToken: req.csrfToken(),
      user: req.user,
      isAdmin: req.user?.role?.name === 'admin',
      errorMessage: 'Invalid URL. Please enter a valid URL.'
    });
  }

  try {
    const shortUrl = shortid.generate();
    const newUrl = new Url({
      originalUrl,
      shortUrl,
      userId: req.user.userId,
    });

    await newUrl.save();
    res.cookie('shortUrl', shortUrl, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error creating short URL', error);
    res.status(500).json({ error: 'Error creating short URL' });
  }
};

export const redirectToOriginalUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    const country = geo?.country || 'Unknown';

    const clickData = {
      ip,
      referer: req.get('Referer'),
      userAgent: req.get('User-Agent'),
      country,
      timestamp: new Date()
    };

    url.clicks.push(clickData);
    await url.save();

    const stats = calculateStatistics(url);

    io.emit('clickUpdate', { shortUrl: url.shortUrl, clickCount: url.clicks.length, stats });

    const totalClicks = await getTotalClicks();
    const bestShortlink = await getBestShortlink();
    io.emit('updateStats', { 
      totalClicks: totalClicks || 0, 
      bestShortlink: bestShortlink ? bestShortlink.shortUrl : '', 
      bestShortlinkClicks: bestShortlink ? bestShortlink.clicks.length : 0,
      stats: {
        averageDailyClicks: stats.averageDailyClicks,
        averageWeeklyClicks: stats.averageWeeklyClicks,
        averageMonthlyClicks: stats.averageMonthlyClicks
      }
    });

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting URL', error);
    res.status(500).json({ error: 'Error redirecting URL' });
  }
};
