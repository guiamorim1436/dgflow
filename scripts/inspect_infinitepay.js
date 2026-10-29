import fs from 'fs';
import path from 'path';

const projectRoot = 'C:/Users/gui14/Projects/dgflow/public/assets';

const files = fs.readdirSync(projectRoot).filter(f => f.endsWith('.js'));

const matches = [];

for (const f of files) {
  const full = path.join(projectRoot, f);
  const content = fs.readFileSync(full, 'utf8');
  if (content.toLowerCase().includes('infinitepay') || content.includes('$tenno')) {
    matches.push(f);
  }
}

console.log('Files referencing InfinitePay:', matches);
