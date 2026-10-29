import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

const idx = content.indexOf('function zne(');
const idx2 = content.indexOf('const zne=');
const idx3 = content.indexOf('zne=');

console.log({ idx, idx2, idx3 });
const pos = [idx, idx2, idx3].find(p => p !== -1);
if (pos) {
  console.log(content.slice(pos, pos + 500));
}
