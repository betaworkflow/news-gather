const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function fetchAssets() {
  const { data, error } = await supabase
    .from('assets')
    .select('*');

  if (error) {
    console.error('Error fetching assets:', error);
  } else {
    console.log('Fetched assets:', data);
  }
}

fetchAssets();
