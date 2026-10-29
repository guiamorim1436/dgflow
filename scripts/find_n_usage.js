import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('N=l?F:f');
console.log('N usage in fi:');
console.log(content.slice(idx, idx + 1000));
