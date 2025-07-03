const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function saveNews(newsList) {
  if (!Array.isArray(newsList) || newsList.length === 0) {
    console.warn('⚠️ ไม่มีข่าวที่จะบันทึก');
    return;
  }

  const newItems = [];

  for (const item of newsList) {
    const { data: existing, error: checkError } = await supabase
      .from('news')
      .select('id')
      .eq('title', item.title)
      .eq('pubDate', item.pubDate)
      .maybeSingle();

    if (checkError) {
      console.error(`❌ ตรวจข่าวซ้ำล้มเหลว: ${item.title}`, checkError.message);
      continue;
    }

    if (!existing) {
      newItems.push(item);
    }
  }

  if (newItems.length === 0) {
    console.log("✅ ไม่พบข่าวใหม่ที่จะบันทึก (ทุกข่าวมีอยู่แล้ว)");
    return;
  }

  const { data, error } = await supabase.from('news').insert(newItems).select();
  if (error) {
    console.error('❌ Error saving news:', error.message);
    return;
  }

  console.log(`✅ บันทึกข่าว ${data.length} รายการแล้ว`);
}

module.exports = saveNews;
