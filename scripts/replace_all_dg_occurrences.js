import fs from 'fs';
import path from 'path';

const projectRoot = 'C:/Users/gui14/Projects/dgflow';

// Target files to sanitize
const filesToProcess = [
  'public/assets/Admin-DIitkSWg.js',
  'public/assets/Lp3-BiOP2ACN.js',
  'public/assets/DataDeletion-WSuoW5fF.js',
  'public/assets/Subscription-DN9coBP-.js',
  'public/assets/useUpgradeCalculation-C14KDz0_.js',
  'src/app/layout.tsx',
  'index.html'
];

const replacements = [
  { search: /Recuperação DGDireto/g, replace: 'Recuperação Tenno Direto' },
  { search: /DGDireto/g, replace: 'Tenno Direto' },
  { search: /app\.dgflow\.vercel\.app/g, replace: 'app.tennoflow.com.br' },
  { search: /https:\/\/dgflow\.vercel\.app/g, replace: 'https://tennoflow.com.br' },
  { search: /https:\/\/dgflow\.app/g, replace: 'https://tennoflow.com.br' },
  { search: /dgflow\.app/g, replace: 'tennoflow.com.br' },
  { search: /da DGflow/g, replace: 'do Tenno Flow' },
  { search: /da dgflow/gi, replace: 'do Tenno Flow' },
  { search: /contato@dgflow\.vercel\.app/g, replace: 'contato@tennoflow.com.br' },
  { search: /https:\/\/hotmart\.com\/pt-br\/club\/dgflow/g, replace: 'https://tennoflow.com.br/subscription' },
  { search: /PAGARME_API_KEY_DIEGO/g, replace: 'PAGARME_API_KEY_PADRAO' },
  { search: /value:"diego",children:"Diego"/g, replace: 'value:"padrao",children:"Padrão"' },
  { search: /"Diego Brandão"/g, replace: '"Tenno Studio"' },
  { search: /"DGFLOW"/g, replace: '"Tenno Flow"' },
  { search: /DGFlow — Plataforma de gestão/g, replace: 'Tenno Flow — Plataforma de gestão' },
  { search: /DGFlow/g, replace: 'Tenno Flow' }
];

let totalModified = 0;

for (const relPath of filesToProcess) {
  const fullPath = path.join(projectRoot, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;

  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated: ${relPath}`);
    totalModified++;
  } else {
    console.log(`No changes needed for: ${relPath}`);
  }
}

console.log(`Done! Modified ${totalModified} files.`);
