import shortid from 'shortid';
import Url from '../models/Url.js';
import io from '../app.js';

export const createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const shortUrl = shortid.generate();

  try {
    const newUrl = new Url({
      originalUrl,
      shortUrl,
      userId: req.user.userId,
    });

    await newUrl.save();
    res.render('shortened', { shortUrl, csrfToken: req.csrfToken(), req });
  } catch (error) {
    console.error('Error creating short URL:', error);
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

    url.clicks.push({
      ip: req.ip,
      referer: req.get('Referer'),
    });

    await url.save();

    io.emit('clickUpdate', { shortUrl: url.shortUrl, clickCount: url.clicks.length });

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ error: 'Error redirecting URL' });
  }
};
