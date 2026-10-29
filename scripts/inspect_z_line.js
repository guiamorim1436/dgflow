import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('z=(p==null?void 0:p.is_active)||x||P');
console.log(content.slice(idx - 100, idx + 300));
