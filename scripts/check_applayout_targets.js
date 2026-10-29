import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const target1 = 'z=(p==null?void 0:p.is_active)||x||P,G=';
const target2 = 'const[se,M]=d.useState(["Tarefas","Agentes IA","WhatsApp"])';
const target3 = '_t=ue&&U.children.some(K=>wt(K.href)),na=l||se.includes(U.name)';

console.log('target1 found?', content.includes(target1));
console.log('target2 found?', content.includes(target2));
console.log('target3 found?', content.includes(target3));
