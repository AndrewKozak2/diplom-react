const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: Number,
  brand: String,
  name: String,
  scale: String,
  price: Number,
  image: String,
  inStock: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
