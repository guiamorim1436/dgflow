import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

const idx = content.indexOf('SUPABASE_ANON_KEY');
console.log(content.slice(idx - 200, idx + 200));
