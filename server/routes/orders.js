const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');
const sendTelegramMessage = require('../utils/sendTelegramMessage');
const { verifyUser } = require('../middlewares/auth'); 

function generateOrderEmail(order) {
  const itemsHtml = order.cart.map(item => `
    <tr>
      <td style="padding: 10px; text-align: center;">
        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
      </td>
      <td style="padding: 10px;">${item.name}</td>
      <td style="padding: 10px;">× ${item.quantity}</td>
      <td style="padding: 10px;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join("");

  return `
    <div style="background: linear-gradient(135deg, #e0f2fe, #f1f5f9); padding: 40px 0;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); font-family: 'Arial', sans-serif;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center; font-size: 28px; font-weight: bold;">
          TrueScale
        </div>
        <div style="padding: 20px;">
          <h2 style="text-align: center; color: #1f2937;">Дякуємо за замовлення!</h2>
          <p><strong>Ім'я:</strong> ${order.firstName} ${order.lastName}</p>
          <p><strong>Місто:</strong> ${order.city}</p>
          <p><strong>Відділення:</strong> ${order.warehouse}</p>
          <p><strong>Телефон:</strong> ${order.phone}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Оплата:</strong> —</p>

          <h3 style="margin-top: 20px; color: #1f2937;">Ваше замовлення:</h3>
          <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
            ${itemsHtml}
          </table>

          <div style="text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold;">
            Разом: $${order.total.toFixed(2)}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://truescale.shop" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Перейти на сайт</a>
          </div>

          <div style="margin-top: 40px; text-align: center; font-size: 16px; color: #6b7280;">
            <img src="https://cdn-icons-png.flaticon.com/512/743/743922.png" alt="Car Icon" style="width: 40px; height: auto; margin-bottom: 10px;" />
            <p>Дякуємо, що обрали <strong>TrueScale</strong>!</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateTelegramMessage(order) {
  const itemsText = order.cart.map(item => `• ${item.name} × ${item.quantity}`).join('\n');

  return `
<b>Нове замовлення на TrueScale!</b>\n
👤 <b>Ім'я:</b> ${order.firstName} ${order.lastName}
🏙️ <b>Місто:</b> ${order.city}
🏢 <b>Відділення:</b> ${order.warehouse}
📞 <b>Телефон:</b> ${order.phone}
✉️ <b>Email:</b> ${order.email}
💳 💳 <b>Оплата:</b> —


<b>Товари:</b>
${itemsText}

💵 <b>Сума:</b> $${order.total.toFixed(2)}
  `;
}

router.post('/orders', async (req, res) => {
  try {
    const { firstName, lastName, city, warehouse, phone, email, cart, total } = req.body;

    const order = new Order({ firstName, lastName, city, warehouse, phone, email, cart, total });
    await order.save();

    const htmlContent = generateOrderEmail(order);
    const telegramMessage = generateTelegramMessage(order);

    await sendEmail(email, 'Ваше замовлення на TrueScale', htmlContent);
    await sendTelegramMessage(telegramMessage);

    res.status(201).json({ message: 'Замовлення успішно створено' });
  } catch (error) {
    console.error('Помилка при створенні замовлення:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.get('/orders/my', verifyUser, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const orders = await Order.find({ email: userEmail }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Помилка при отриманні замовлень користувача:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;
