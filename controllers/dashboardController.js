import Url from '../models/Url.js';
import io from '../app.js';

export const getDashboard = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.userId });
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    res.render('dashboard', { urls, csrfToken: req.csrfToken(), req });
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
