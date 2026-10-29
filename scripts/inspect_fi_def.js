import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('function fi(');
const idx2 = content.indexOf('const fi=');
console.log({ idx, idx2 });
const pos = [idx, idx2].find(p => p !== -1);
if (pos) {
  console.log(content.slice(pos, pos + 2500));
}
