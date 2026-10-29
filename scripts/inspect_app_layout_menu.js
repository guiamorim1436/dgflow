import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

// Find menu filtering or useProductionCounterVisibility
const matches = [...content.matchAll(/(.{0,80}(?:useMenu|menu_hidden|hidden|filter|sidebar|menuItems).{0,100})/g)];
console.log('AppLayout matches:');
matches.slice(0, 15).forEach(m => console.log(' ->', m[0].trim()));
