import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

// Find ft definition
const matches = [...content.matchAll(/(.{0,50}(?:\bft\s*=|function ft\b|\bft\b:\s*).{0,100})/g)];
console.log('Matches for ft:');
matches.slice(0, 10).forEach(m => console.log(' ->', m[0].trim()));
