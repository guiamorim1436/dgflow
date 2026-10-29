import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('G=[{name:a("navigation.dashboard")');
console.log(content.slice(idx, idx + 1800));
