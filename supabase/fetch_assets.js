require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function fetchAssets() {
  const { data, error } = await supabase
    .from('assets')
    .select('*');

  if (error) {
    console.error('Error fetching assets:', error);
    return [];
  }

  return data;
}

module.exports = fetchAssets;
