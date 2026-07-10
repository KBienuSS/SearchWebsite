const Ad = require('../models/ad.model');

const isOwner = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    if (ad.seller.toString() !== req.session.user.id) {
      return res.status(403).json({ error: 'You are not the owner of this ad' });
    }

    req.ad = ad;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = isOwner;