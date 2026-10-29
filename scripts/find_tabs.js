import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/Admin-DIitkSWg.js', 'utf8');

const matches = [...content.matchAll(/(.{0,80}(?:defaultValue:"pagarme"|value:"pagarme"|TabsList|TabsTrigger).{0,120})/g)];
console.log('Tabs matches:');
matches.forEach(m => console.log(' ->', m[0].trim()));
