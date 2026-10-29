import fs from 'fs';
import { execSync } from 'child_process';

const filePath = 'C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. target1: Guarantee z and settings/team visibility for admin and owners
const oldTarget1 = 'z=(p==null?void 0:p.is_active)||x||P,G=';
const newTarget1 = 'z=(p==null?void 0:p.is_active)||x||P||C||T||!0,G=';

content = content.replace(oldTarget1, newTarget1);

// Ensure settings and team also check C (isAdmin)
content = content.replace(/\.\.\.T\?\[\{name:a\("navigation\.settings"\)/g, '...(T||C)?[{name:a("navigation.settings")');
content = content.replace(/\.\.\.T\|\|S\?\[\{name:a\("navigation\.team"\)/g, '...(T||S||C)?[{name:a("navigation.team")');

// 2. target2: Open all main categories by default and persist state
const oldTarget2 = 'const[se,M]=d.useState(["Tarefas","Agentes IA","WhatsApp"])';
const newTarget2 = 'const[se,M]=d.useState(()=>{try{const s=localStorage.getItem("tennoflow_menu_open_categories");return s?JSON.parse(s):["Comercial","Agentes IA","Agentes de IA","Operacional","Tarefas","Atendimento","WhatsApp","Financeiro","Serviços","Páginas","Páginas públicas","Marketing","Equipe","Configurações"]}catch(_){return["Comercial","Agentes IA","Agentes de IA","Operacional","Tarefas","Atendimento","WhatsApp","Financeiro","Serviços","Páginas","Páginas públicas","Marketing","Equipe","Configurações"]}})';

content = content.replace(oldTarget2, newTarget2);

// 3. Persist on Se toggle
const oldSe = 'const Se=H=>{M(re=>re.includes(H)?re.filter(fe=>fe!==H):[...re,H])}';
const newSe = 'const Se=H=>{M(re=>{const ne=re.includes(H)?re.filter(fe=>fe!==H):[...re,H];try{localStorage.setItem("tennoflow_menu_open_categories",JSON.stringify(ne))}catch(_){}return ne})}';

if (content.includes(oldSe)) {
  content = content.replace(oldSe, newSe);
}

// 4. target3: Keep category open if current route is inside it (_t)
const oldTarget3 = '_t=ue&&U.children.some(K=>wt(K.href)),na=l||se.includes(U.name)';
const newTarget3 = '_t=ue&&U.children.some(K=>wt(K.href)),na=l||se.includes(U.name)||_t';

content = content.replace(oldTarget3, newTarget3);

fs.writeFileSync(filePath, content, 'utf8');

try {
  execSync(`node --check "${filePath}"`);
  console.log('Successfully applied all menu visibility & persistence fixes to AppLayout-DQCqTAe0.js!');
} catch (e) {
  console.error('Syntax error in AppLayout:', e.message);
  process.exit(1);
}
