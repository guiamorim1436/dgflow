import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/Admin-DIitkSWg.js', 'utf8');

const idx = content.indexOf('function Ji()');
console.log('Context of Ji:');
console.log(content.slice(idx - 100, idx + 400));
