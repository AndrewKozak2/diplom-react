const mongoose = require("mongoose");

const limitedProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  countInStock: Number,
  brand: String
});

module.exports = mongoose.model("LimitedProduct", limitedProductSchema);
