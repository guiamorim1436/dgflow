import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('U.children.map');
const idx2 = content.indexOf('U.children.some');
console.log({ idx, idx2 });
const pos = [idx, idx2].find(p => p !== -1);
if (pos) {
  console.log(content.slice(pos - 200, pos + 1200));
}
