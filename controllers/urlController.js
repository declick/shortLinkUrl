import shortid from 'shortid';
import Url from '../models/Url.js';
import io from '../app.js';
import geoip from 'geoip-lite';

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

export const createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;

  try {
    // Créez un nouveau shortlink
    const shortUrl = shortid.generate();
    const newUrl = new Url({
      originalUrl,
      shortUrl,
      userId: req.user.userId,
    });

    await newUrl.save();

    // Set the shortUrl in a cookie (replace 2 days with your desired expiration)
    res.cookie('shortUrl', shortUrl, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true });

    // Redirigez vers la page de résultat
    res.redirect('/shortened');
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
    const country = geo && geo.country ? geo.country : 'Unknown';

    url.clicks.push({
      ip,
      referer: req.get('Referer'),
      userAgent: req.get('User-Agent'),
      country,
    });

    await url.save();

    const stats = calculateStatistics(url);

    io.emit('clickUpdate', { shortUrl: url.shortUrl, clickCount: url.clicks.length, stats });

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ error: 'Error redirecting URL' });
  }
};

export const renderShortenedPage = (req, res) => {
  const shortUrl = req.cookies.shortUrl; // Retrieve shortUrl from cookie
  if (shortUrl) {
    res.render('shortened', { shortUrl, csrfToken: req.csrfToken(), req });
  } else {
    res.redirect('/shorten');
  }
};