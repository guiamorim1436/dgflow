import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

// Find aO export or declaration
const matches = [...content.matchAll(/(.{0,50}(?:\baO\s*=|function aO\b|\baO\b:\s*).{0,100})/g)];
console.log('Matches for aO in index:');
matches.slice(0, 10).forEach(m => console.log(' ->', m[0].trim()));
