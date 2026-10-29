import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const matches = [...content.matchAll(/(.{0,40}sidebarOpen:.{0,60})/g)];
matches.forEach(m => console.log(' ->', m[0].trim()));
