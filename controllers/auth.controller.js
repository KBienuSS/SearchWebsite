const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const getImageFileType = require('../utils/getImageFileType');
const fs = require('fs');
const path = require('path');

exports.register = async (req, res) => {
  try {
    const { login, password, avatar, phone } = req.body;
    const fileType = req.file ? await getImageFileType(req.file) : 'unknown';

    if (login && typeof login === 'string' && password && typeof password === 'string' && req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType) && phone) {
      const userWithLogin = await User.findOne({ login });
      if (userWithLogin) {
        fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', req.file.filename));
        return res.status(409).send({ message: 'User with this login already exists' });
      }

      const newUser = await User.create({ login, password: await bcrypt.hash(password, 10), avatar: req.file.filename, phone });
      res.status(200).send({ message: 'User created: ' + newUser.login });
    } else {
      fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', req.file.filename));
      res.status(400).json({ message: 'Bad request' });
    }
  } catch (err) {
    fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', req.file.filename));
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password} = req.body;
    if (login && typeof login === 'string' && password && typeof password === 'string') {
      const user = await User.findOne({ login });
      if(!user){
        res.status(400).send({ message: 'Login or password are incorrect'});
      } else {
        if(bcrypt.compareSync(password, user.password)) {
          req.session.user = {id: user.id, login: user.login};
          res.status(200).send({ message: 'Login successful'});
        }
        else {
          res.status(400).send({ message: 'Login or password are incorrect'});
        }
      }
    }  else {
      res.status(400).send({ message: 'Bad request' });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: 'Could not log out, please try again' });
    }
    res.clearCookie('connect.sid');
    res.status(200).send({ message: 'Logout successful' });
  });
};


exports.getUser = async (req, res) => {
  if (req.session.user) {
    res.status(200).send({ user: req.session.user });
  } else {
    res.status(401).send({ message: 'Not authenticated' });
  }
};

