import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/Admin-DIitkSWg.js', 'utf8');

const target = 'value:"gateways",children:e.jsxs(as,{defaultValue:"pagarme"';
const idx = content.indexOf(target);
console.log('Target idx:', idx);

if (idx !== -1) {
  console.log('Gateway tabs block:');
  console.log(content.slice(idx - 100, idx + 800));
}
