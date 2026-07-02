const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  seller: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Ad', adSchema);