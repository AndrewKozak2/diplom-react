const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    brand: String,
    name: String,
    scale: String,
    price: Number,
    image: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
