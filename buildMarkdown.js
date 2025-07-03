const fs = require('fs');
const path = require('path');

function buildMarkdown(newsList) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const highlighted = newsList.filter(n => n.priority);
  const normal = newsList.filter(n => !n.priority);

  let md = `# 📰 สรุปข่าวประจำวัน ${today}\n\n`;

  // Highlighted section
  if (highlighted.length > 0) {
    md += `## 📌 ข่าวสำคัญ (Priority)\n`;
    for (const n of highlighted) {
      md += `- [${n.title}](${n.link})\n`;
    }
    md += `\n`;
  }

  // Other news by keyword category (fallback = Uncategorized)
  const categoryMap = {};
  for (const n of normal) {
    const category = (n.hitKeywords && n.hitKeywords.length > 0) ? n.hitKeywords[0] : 'Uncategorized';
    if (!categoryMap[category]) categoryMap[category] = [];
    categoryMap[category].push(n);
  }

  for (const [cat, items] of Object.entries(categoryMap)) {
    md += `## 📂 ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n`;
    for (const n of items) {
      md += `- [${n.title}](${n.link})\n`;
    }
    md += `\n`;
  }

  const filename = `news-${today}.md`;
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, md, 'utf8');
  console.log(`✅ Markdown report saved to: ${filepath}`);
  return { filename, content: md };
}

module.exports = buildMarkdown;
