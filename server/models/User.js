const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  brand: String,
  scale: String,
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'user' },
  cart: [cartItemSchema] // 🆕
});

const User = mongoose.model('User', userSchema);

module.exports = User;
