import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

const idx = content.lastIndexOf('as aO');
console.log('as aO context:');
console.log(content.slice(Math.max(0, idx - 100), idx + 100));
