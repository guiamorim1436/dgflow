import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const matches = [...content.matchAll(/(.{0,50}(?:ps as|Nn as|wa as|Ks as|[^\w]Ks\s*=|function Ks\b|[^\w]ps\s*=|function ps\b).{0,80})/g)];
console.log('Matches for Ks, Nn, ps, wa:');
matches.forEach(m => console.log(' ->', m[0].trim()));
