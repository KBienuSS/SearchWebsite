const Ad = require('../models/ad.model');
const getImageFileType = require('../utils/getImageFileType');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
  try {
    res.json(await Ad.find());
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if(!ad) res.status(404).json({ error: 'Ad not found' });
    else res.json(ad);
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getByPhrase = async (req, res) => {
  try {
    const ad = await Ad.find({ title: { $regex: req.params.safePhrase, $options: 'i' } });
    if (ads.length === 0) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    res.json(ad);
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.create = async (req, res) => {
  const { title, content, date, image, price, location, seller } = req.body;
  const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
  const imageFileName = req.file.filename
  if(title &&
      typeof title === 'string' &&
      content && 
      date &&
      req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType) &&
      price &&
      location &&
      seller){

    try {
      const newAd = new Ad({ title, content, date, imageFileName , price, location, seller });
      await newAd.save();
      res.status(201).json(newAd);
    } catch(err) {
      fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', req.file.filename));
      res.status(500).json({ message: err });
    }

  } else {
    fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', req.file.filename));
    return res.status(400).json({ error: 'Missing required fields' });
  }


};

exports.update = async (req, res) => {
  const { title, content, date, price, location } = req.body;

  try{

    if (req.file) {
      const fileType = await getImageFileType(req.file);
      if (!['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
        fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', req.file.filename));
        return res.status(400).json({ error: 'Invalid image file type' });
      }
    }

    if (!title || typeof title !== 'string' || !content || !date || price == null || !location) {
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', req.file.filename));
      }
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingAd = await Ad.findById(req.params.id);
    if (!existingAd) {
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', req.file.filename));
      }
      return res.status(404).json({ error: 'Ad not found' });
    }

    const updateData = { title, content, date, price, location };
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Ad.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (req.file && existingAd.image) {
      fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', existingAd.image));
    }

    res.json(updated);
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', req.file.filename));
    }
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if(!ad) return res.status(404).json({ error: 'Ad not found' });
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
};