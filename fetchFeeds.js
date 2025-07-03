const Parser = require('rss-parser');
const parser = new Parser();

// รายการ RSS feed ทั้งหมด
const rssFeeds = [
  "https://www.scmp.com/rss/92/feed",
  "https://www.cnbc.com/id/10000664/device/rss/rss.html",
  "https://www.investing.com/rss/news.rss",
  "https://asia.nikkei.com/rss/feed/nar",
  "https://www.euronews.com/rss?level=theme&name=business",
  "https://asiatimes.com/feed/",
];

// ฟังก์ชันหลัก
async function fetchFeeds() {
  const allNews = [];

  for (const url of rssFeeds) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet || '',
        source: url
      }));
      allNews.push(...items);
    } catch (error) {
      console.error(`❌ Error fetching ${url}`, error.message);
    }
  }

  // ลบข่าวซ้ำจาก title + link
  const uniqueNews = Array.from(new Map(
    allNews.map(news => [news.title + news.link, news])
  ).values());

  return uniqueNews;
}

module.exports = fetchFeeds;
