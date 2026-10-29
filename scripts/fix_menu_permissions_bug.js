import fs from 'fs';
import { execSync } from 'child_process';

const filePath = 'C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix My() return values when c is null (solo user = owner and admin)
const oldMy = 'u=(c==null?void 0:c.isOwner)??!1,m=(c==null?void 0:c.membership.role)==="admin"||u,p=(c==null?void 0:c.membership.role)==="collaborator"';
const newMy = 'u=(c==null?!0:!!c.isOwner),m=(c==null?!0:((c.membership.role==="admin")||u)),p=(c==null?!1:c.membership.role==="collaborator")';

if (!content.includes(oldMy)) {
  console.error('Could not find oldMy in index-G-E061gt.js');
  process.exit(1);
}
content = content.replace(oldMy, newMy);

// 2. Fix k_() to ensure hasFullAccess is true when activeTeam is null or user has full access
const oldK = 'k_=()=>{const{activeTeam:t,isOwner:e,isAdmin:a,isLoading:o,teamsFailed:r}=My(),n=e||a||o||r,s=(t==null?void 0:t.membership.permissions)||{}';
const newK = 'k_=()=>{const{activeTeam:t,isOwner:e,isAdmin:a,isLoading:o,teamsFailed:r}=My(),n=e||a||o||r||!t,s=(t==null?void 0:t.membership.permissions)||{}';

if (!content.includes(oldK)) {
  console.error('Could not find oldK in index-G-E061gt.js');
  process.exit(1);
}
content = content.replace(oldK, newK);

fs.writeFileSync(filePath, content, 'utf8');

try {
  execSync(`node --check "${filePath}"`);
  console.log('Successfully fixed menu permissions bug and verified syntax in index-G-E061gt.js!');
} catch (e) {
  console.error('Syntax error after fix:', e.message);
  process.exit(1);
}
