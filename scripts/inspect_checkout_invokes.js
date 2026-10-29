import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/Checkout-2v9cVefV.js', 'utf8');

const matches = [...content.matchAll(/functions\.invoke\([^)]+\)/g)];
console.log('functions.invoke calls in Checkout:');
matches.forEach(m => console.log('  ->', m[0]));
