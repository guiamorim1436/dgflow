import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const matches = [...content.matchAll(/(.{0,80}daysRemaining.{0,100})/g)];
matches.slice(0, 5).forEach(m => console.log(' ->', m[0].trim()));
