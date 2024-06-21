// controllers/dashboardController.js

import Url from '../models/Url.js';
import io from '../app.js';

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

export const getTotalClicks = async () => {
  const urls = await Url.find();
  if (!urls || urls.length === 0) {
    return 0; // Retourner 0 si aucun lien n'est trouvé
  }
  return urls.reduce((acc, url) => acc + (url.clicks ? url.clicks.length : 0), 0);
};

export const getBestShortlink = async () => {
  const urls = await Url.find();
  if (!urls || urls.length === 0) {
    return null; // Retourner null si aucun lien n'est trouvé
  }
  return urls.reduce((max, url) => (url.clicks ? url.clicks.length : 0) > (max.clicks ? max.clicks.length : 0) ? url : max, urls[0]);
};
