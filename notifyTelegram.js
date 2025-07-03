const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const BOT_TOKEN = '7683887035:AAHFWJQ_cu4KKHPhgcRCIco6SnCuJdwWMto';
const CHAT_ID = '7977736674';

async function notifyTelegram({ message, filePath }) {
  try {
    // Step 1: Send text message (optional)
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
    });

    // Step 2: Send .md file as document
    const fileName = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('document', fileStream, fileName);

    const headers = formData.getHeaders();

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, formData, { headers });

    console.log('✅ ส่งไฟล์ .md ไปยัง Telegram เรียบร้อยแล้ว');
  } catch (error) {
    console.error('❌ ส่ง Telegram ล้มเหลว:', error.message);
  }
}

module.exports = notifyTelegram;
