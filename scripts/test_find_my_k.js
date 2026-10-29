import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

const targetMy = `u=(c==null?void 0:c.isOwner)??!1,m=(c==null?void 0:c.membership.role)==="admin"||u,p=(c==null?void 0:c.membership.role)==="collaborator"`;
const targetK = `k_=()=>{const{activeTeam:t,isOwner:e,isAdmin:a,isLoading:o,teamsFailed:r}=My(),n=e||a||o||r,s=(t==null?void 0:t.membership.permissions)||{}`;

console.log('targetMy exists?', content.includes(targetMy));
console.log('targetK exists?', content.includes(targetK));
