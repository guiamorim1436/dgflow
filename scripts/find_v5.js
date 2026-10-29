import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

const idx = content.indexOf('V5=');
console.log(content.slice(idx - 100, idx + 400));
