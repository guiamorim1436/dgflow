import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/Admin-DIitkSWg.js', 'utf8');

const idx = content.indexOf('function Ji(');
console.log('Ji code:');
console.log(content.slice(idx, idx + 1200));
