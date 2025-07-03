const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getKeywords() {
  const { data, error } = await supabase.from('keywords').select('Keyword');
  if (error) {
    console.error("❌ Error fetching keywords:", error.message);
    return [];
  }
  return data.map(k => k.Keyword.toLowerCase());
}

async function matchKeywords(newsList) {
  const keywords = await getKeywords();
  const matched = newsList.map(item => {
    const text = (item.title + ' ' + item.contentSnippet).toLowerCase();
    const hitKeywords = keywords.filter(k => text.includes(k));
    return {
      ...item,
      priority: hitKeywords.length > 0,
      hitKeywords
    };
  });
  return matched;
}

module.exports = matchKeywords;
