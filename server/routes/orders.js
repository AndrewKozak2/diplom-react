const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");
const sendTelegramMessage = require("../utils/sendTelegramMessage");
const { verifyUser } = require("../middlewares/auth");

function generateOrderEmail(order) {
  const itemsHtml = order.cart
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; text-align: center;">
<img src="${
        item.image?.startsWith("http")
          ? item.image
          : "https://truescale.up.railway.app" +
            (item.image || item.images?.[0])
      }" alt="${item.name}"
 style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
      </td>
      <td style="padding: 10px;">${item.name}</td>
      <td style="padding: 10px;">× ${item.quantity}</td>
      <td style="padding: 10px;">$${(item.price * item.quantity).toFixed(
        2
      )}</td>
    </tr>
  `
    )
    .join("");

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
          <p><strong>Оплата:</strong> Карткою</p>
          ${
            order.promoCode
              ? `<p><strong>Promo Code:</strong> ${order.promoCode}</p>`
              : ""
          }

          <h3 style="margin-top: 20px; color: #1f2937;">Ваше замовлення:</h3>
          <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
            ${itemsHtml}
          </table>

          <div style="text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold;">
            Разом: $${order.total.toFixed(2)}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://truescale.up.railway.app" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Перейти на сайт</a>
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
  console.log(
    "🧪 Створюється замовлення:",
    JSON.stringify(order.cart, null, 2)
  );

  const itemsText = order.cart
    .map((item) => {
      const base = `• ${item.name || "Unknown"} × ${item.quantity}`;
      const priceLine = `💵 <b>Price:</b> $${item.price.toFixed(2)}`;

      const isCustom =
        (item.name && item.name.includes("(Custom)")) ||
        (item.id && item.id.startsWith("custom-"));

      const colorInfo = isCustom
        ? `🎨 <b>Body:</b> ${item.color || "N/A"}\n🛞 <b>Wheels:</b> ${
            item.wheelColor || "N/A"
          }`
        : "";

      return `${base}\n${colorInfo ? colorInfo + "\n" : ""}${priceLine}`;
    })
    .join("\n\n");

  return `
<b>Нове замовлення на TrueScale!</b>

👤 <b>Ім'я:</b> ${order.firstName} ${order.lastName}
🏙️ <b>Місто:</b> ${order.city}
🏢 <b>Відділення:</b> ${order.warehouse}
📞 <b>Телефон:</b> ${order.phone}
✉️ <b>Email:</b> ${order.email}
💳 <b>Оплата:</b> Карткою
${order.promoCode ? `🏷️ <b>Промокод:</b> ${order.promoCode}` : ""}

<b>Товари:</b>
${itemsText}

💵 <b>Сума:</b> $${order.total.toFixed(2)}
  `;
}

router.post("/orders", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      city,
      warehouse,
      phone,
      email,
      cart,
      total,
      promoCode,
    } = req.body;

    const order = new Order({
      firstName,
      lastName,
      city,
      warehouse,
      phone,
      email,
      cart,
      total,
      promoCode,
    });
    await order.save();

    if (promoCode) {
      try {
        const Promo = require("../models/PromoCode");
        await Promo.findOneAndUpdate(
          { code: promoCode },
          {
            $inc: { usageCount: 1 },
            $push: { usedBy: { email, usedAt: new Date() } },
          }
        );
      } catch (err) {
        console.error("❌ Error updating promo code stats:", err);
      }
    }

    const htmlContent = generateOrderEmail(order);
    const telegramMessage = generateTelegramMessage(order);

    await sendEmail(email, "Ваше замовлення на TrueScale", htmlContent);
    await sendTelegramMessage(telegramMessage);

    res.status(201).json({ message: "Замовлення успішно створено" });
  } catch (error) {
    console.error("Помилка при створенні замовлення:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.get("/orders/my", verifyUser, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const orders = await Order.find({ email: userEmail }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Помилка при отриманні замовлень користувача:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

const { verifyAdmin } = require("../middlewares/auth");

router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const promoStats = await Order.aggregate([
      { $match: { promoCode: { $ne: null } } },
      { $group: { _id: "$promoCode", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      promoStats,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
