const express = require('express');
const bodyParser = require('body-parser');
const fetchFeeds = require('./fetchFeeds');
const matchKeywords = require('./matchKeywords');
const saveNews = require('./saveNews');
const buildMarkdown = require('./buildMarkdown');
const notifyTelegram = require('./notifyTelegram');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = '7683887035:AAHFWJQ_cu4KKHPhgcRCIco6SnCuJdwWMto';

// Endpoint สำหรับเชื่อมกับ Telegram Webhook
app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
  const message = req.body.message;
  if (!message || !message.text) {
    return res.sendStatus(200);
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  if (text === '/run') {
    try {
      await notifyTelegram({
        message: '🔄 เริ่มดึงข่าวล่าสุด กรุณารอสักครู่...',
        filePath: null,
        chatId
      });

      const news = await fetchFeeds();
      const newsWithKeywords = await matchKeywords(news);
      await saveNews(newsWithKeywords);
      const report = buildMarkdown(newsWithKeywords);

      await notifyTelegram({
        message: `✅ เสร็จสิ้น: รายงานข่าวประจำวันที่ ${new Date().toISOString().split('T')[0]}`,
        filePath: __dirname + '/' + report.filename,
        chatId
      });
    } catch (err) {
      await notifyTelegram({
        message: `❌ เกิดข้อผิดพลาด: ${err.message}`,
        filePath: null,
        chatId
      });
    }
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('✅ Telegram Webhook Server is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
