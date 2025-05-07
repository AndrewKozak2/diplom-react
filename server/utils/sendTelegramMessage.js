const axios = require('axios');
require('dotenv').config();

async function sendTelegramMessage(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML' 
    });
    console.log('Telegram повідомлення надіслано');
  } catch (error) {
    console.error('Помилка при надсиланні повідомлення в Telegram:', error.message);
  }
}

module.exports = sendTelegramMessage;
