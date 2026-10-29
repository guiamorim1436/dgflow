import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/Admin-DIitkSWg.js', 'utf8');

const idx = content.indexOf('function Ji()');
const endIdx = content.indexOf('function In()', idx);
console.log('Between Ji and In:');
console.log(content.slice(idx, endIdx + 50));
