const fetchFeeds = require('./fetchFeeds');
const matchKeywords = require('./matchKeywords');
const saveNews = require('./saveNews');
const buildMarkdown = require('./buildMarkdown');
const notifyTelegram = require('./notifyTelegram');

(async () => {
  const news = await fetchFeeds();
  const newsWithKeywords = await matchKeywords(news);

  console.log(`✅ ข่าวทั้งหมด: ${newsWithKeywords.length}`);
  console.log(`🔥 ข่าวสำคัญ: ${newsWithKeywords.filter(n => n.priority).length}`);
  console.log(newsWithKeywords.slice(0, 3)); // แสดงข่าว 3 ตัวอย่าง

  await saveNews(newsWithKeywords); // บันทึกลง Supabase

  // ✅ สร้าง Markdown report
  const report = buildMarkdown(newsWithKeywords);

  // ✅ ส่งไฟล์ .md ไป Telegram
  await notifyTelegram({
    message: `📰 รายงานข่าวประจำวันที่ ${new Date().toISOString().split('T')[0]}`,
    filePath: __dirname + '/' + report.filename
  });
})();
