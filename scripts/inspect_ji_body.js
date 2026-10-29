import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/Admin-DIitkSWg.js', 'utf8');

const idx = content.indexOf('function Ji()');
console.log('Ji and next 2500 chars:');
console.log(content.slice(idx, idx + 2500));
