import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

const pos = 565000;
console.log(content.slice(pos, pos + 1000));
