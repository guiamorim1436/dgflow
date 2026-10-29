import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

// Search for imports at the top
console.log('Imports snippet:');
console.log(content.slice(0, 1000));
