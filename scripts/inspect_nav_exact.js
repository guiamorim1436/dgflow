import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('G=[{name:a("navigation.dashboard")');
console.log('Navigation definition and filtering:');
console.log(content.slice(Math.max(0, idx - 800), Math.min(content.length, idx + 2500)));
