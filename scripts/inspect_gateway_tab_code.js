import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/Admin-DIitkSWg.js', 'utf8');

const idx = content.indexOf('Configuração Pagar.me');
console.log('Context around Configuração Pagar.me:');
console.log(content.slice(Math.max(0, idx - 1200), Math.min(content.length, idx + 1000)));
