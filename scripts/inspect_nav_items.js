import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const matches = [...content.matchAll(/(.{0,80}(?:navigation|navItems|sidebarItems|menuItems|menu_order|filterVisible|isAdmin).{0,100})/g)];
console.log('AppLayout matches for nav:');
matches.slice(0, 15).forEach(m => console.log(' ->', m[0].trim()));
