import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('const{subscription:p,daysRemaining:c,isTrial:m,hasCollaboratorAccess:x}=ss()');
console.log('useSubscription context:');
console.log(content.slice(idx, idx + 1000));
