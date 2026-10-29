import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('L=Ks(G)');
console.log('Ks and Nn functions:');
// Search backwards for function Ks or const Ks
console.log(content.slice(Math.max(0, idx - 1500), idx + 200));
