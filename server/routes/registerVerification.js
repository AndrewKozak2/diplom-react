const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');


const tempUsers = new Map();


router.post('/register-temp', async (req, res) => {
    const { username, email, password } = req.body;
  
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    let tempData = tempUsers.get(email);
  
    let finalUsername = username;
    let finalHashedPassword;
  
    if (password) {
      finalHashedPassword = await bcrypt.hash(password, 10);
    } else if (tempData) {
      finalUsername = tempData.username;
      finalHashedPassword = tempData.hashedPassword;
    } else {
      return res.status(400).json({ message: 'Missing password for new registration' });
    }
  
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 15 * 60 * 1000;
  
    tempUsers.set(email, {
      username: finalUsername,
      email,
      hashedPassword: finalHashedPassword,
      code,
      expires
    });
  
    const html = `<p>Your verification code:</p><h2>${code}</h2><p>This code is valid for 15 minutes.</p>`;
    await sendEmail(email, 'Verify your email - TrueScale', html);
  
    res.status(200).json({ message: 'Verification code sent to email' });
  });
  

router.post('/verify-registration', async (req, res) => {
  const { email, code } = req.body;
  const tempUser = tempUsers.get(email);

  if (!tempUser || tempUser.code !== code || tempUser.expires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired code' });
  }

  const newUser = new User({
    username: tempUser.username,
    email: tempUser.email,
    password: tempUser.hashedPassword,
  });

  await newUser.save();
  tempUsers.delete(email);

  res.status(200).json({ message: 'Account created successfully' });
});

module.exports = router;
