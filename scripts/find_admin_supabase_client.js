import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/Admin-DIitkSWg.js', 'utf8');

// Find where supabase client is in Admin-DIitkSWg.js
const matches = [...content.matchAll(/([a-zA-Z0-9_$]+)\.from\("platform_settings"\)/g)];
console.log('Matches for platform_settings:');
matches.forEach(m => console.log(' -> Client variable:', m[1]));
