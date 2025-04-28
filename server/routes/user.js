const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/auth');
const User = require('../models/User');

router.get('/profile', verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      city: user.city || '',
      warehouse: user.warehouse || '',
      phone: user.phone || '',
    });
  } catch (error) {
    console.error('Помилка при завантаженні профілю:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/update-profile', verifyUser, async (req, res) => {
  try {
    const { username, email, city, warehouse, phone } = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    user.city = city || '';
    user.warehouse = warehouse || '';
    user.phone = phone || '';

    await user.save();

    res.status(200).json({
      username: user.username,
      email: user.email,
      city: user.city,
      warehouse: user.warehouse,
      phone: user.phone,
    });
  } catch (error) {
    console.error('Помилка при оновленні профілю:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
