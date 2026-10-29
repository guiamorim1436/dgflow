import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('s?"lg:w-20":"lg:w-64"),children:[');
console.log(content.slice(idx, idx + 2500));
