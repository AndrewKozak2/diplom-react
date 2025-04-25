const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';


function verifyUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

router.post('/save', verifyUser, async (req, res) => {
  console.log("🛒 Incoming cart save request:", req.body);
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      console.log("⚠️ User not found for email:", req.user.email);
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = req.body.cart;
    await user.save();
    console.log("✅ Cart saved successfully");
    res.status(200).json({ message: 'Cart saved' });
  } catch (err) {
    console.error("❌ Save cart error:", err);
    res.status(500).json({ message: 'Error saving cart' });
  }
});


router.get('/load', verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    res.status(200).json({ cart: user.cart || [] });
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});

module.exports = router;
