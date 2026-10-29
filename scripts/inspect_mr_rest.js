import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('return N?e.jsx(Ea,{texto:"Trocando de');
console.log(content.slice(idx, idx + 2000));
