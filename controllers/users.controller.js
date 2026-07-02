const User = require('../models/User.model');

exports.register = async (req, res) => {
  const { login, password, avatar, phone } = req.body;
  if(!login || !password || !avatar || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newUser = new User({ login, password, avatar, phone });
    await newUser.save();
    res.status(201).json(newUser);
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.login = async (req, res) => {
  try {
    res.json(await Ad.find());
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getUser = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if(!ad) res.status(404).json({ error: 'Ad not found' });
    else res.json(ad);
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

