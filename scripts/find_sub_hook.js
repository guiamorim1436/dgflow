import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

// Find ss export or where useSubscription is defined
const matches = [...content.matchAll(/(.{0,50}(?:useSubscription|subscription_plans|user_subscriptions).{0,100})/g)];
console.log('Matches for subscription hook:');
matches.slice(0, 10).forEach(m => console.log(' ->', m[0].trim()));
