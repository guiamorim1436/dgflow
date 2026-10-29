import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

const idx = content.indexOf('k_=');
const idx2 = content.indexOf('function k_');
console.log({ idx, idx2 });
const pos = [idx, idx2].find(p => p !== -1);
if (pos) {
  console.log(content.slice(pos, pos + 1200));
}
