import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const idx = content.indexOf('{hasAccess:s,hasCollaboratorAccess:r,loading:i,subscription:p,daysRemaining:c,isTrial:m,isExpired:x');
console.log(content.slice(Math.max(0, idx - 200), idx + 2000));
