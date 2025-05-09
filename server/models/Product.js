const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: Number,
  brand: String,
  name: String,
  scale: String,
  price: Number,
  images: {
    type: [String],
    default: function () {
      return this.image ? [this.image, this.image, this.image] : [];
    }
  },
  inStock: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);