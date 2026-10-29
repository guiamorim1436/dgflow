import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const matches = [...content.matchAll(/([a-zA-Z0-9_$]+)=[\w(]*\(\{sidebarOpen:/g)];
matches.forEach(m => console.log(' ->', m[0]));
