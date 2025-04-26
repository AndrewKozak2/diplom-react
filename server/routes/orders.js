const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // 🔥 Ми тут використовуємо модель

router.post('/orders', async (req, res) => {
  try {
    const order = new Order(req.body); // створюємо нове замовлення
    await order.save(); // зберігаємо його у базу
    res.status(201).json({ message: 'Замовлення успішно створено' });
  } catch (error) {
    console.error('Помилка при створенні замовлення:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;
