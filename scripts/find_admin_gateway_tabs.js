import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/Admin-DIitkSWg.js', 'utf8');

// Search for Pagar.me, PIX Asaas, Woovi tabs
const matches = [...content.matchAll(/(.{0,100}(?:Pagar\.me|PIX Asaas|Woovi).{0,150})/g)];
console.log('Matches in Admin-DIitkSWg.js:');
matches.slice(0, 10).forEach(m => console.log(' ->', m[0].trim()));
