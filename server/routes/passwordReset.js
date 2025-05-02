const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const PasswordResetCode = require('../models/PasswordResetCode');

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordResetCode.findOneAndDelete({ email });
    await PasswordResetCode.create({ email, code, expiresAt });

    const html = `<p>Your password reset code is:</p><h2>${code}</h2><p>It expires in 15 minutes.</p>`;
    await sendEmail(email, 'Your Reset Code - TrueScale', html);
  }

  return res.status(200).json({ message: 'If email exists, code was sent.' });
});

router.post('/verify-reset-code', async (req, res) => {
  const { email, code } = req.body;
  const entry = await PasswordResetCode.findOne({ email, code });

  if (!entry || entry.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired code.' });
  }

  return res.status(200).json({ message: 'Code valid.' });
});

router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  await user.save();
  await PasswordResetCode.deleteOne({ email });

  res.status(200).json({ message: 'Password updated successfully.' });
});

module.exports = router;