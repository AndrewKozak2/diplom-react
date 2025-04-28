const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  scale: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart: [cartItemSchema],
  city: { type: String, default: '' },        
  warehouse: { type: String, default: '' },    
  phone: { type: String, default: '' },        
});

const User = mongoose.model('User', userSchema);

module.exports = User;
