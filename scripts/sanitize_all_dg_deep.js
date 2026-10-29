import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const assetsDir = 'C:/Users/gui14/Projects/dgflow/public/assets';

const fileReplacements = [
  {
    file: 'Admin-DIitkSWg.js',
    replaces: [
      { from: /dgflow\.vercel\.app\/t\//g, to: 'tennoflow.com.br/t/' },
      { from: /f==="next"\?"Next":"Diego"/g, to: 'f==="next"?"Next":"Padrão"' },
      { from: /s==="diego"/g, to: 's==="padrao"' },
      { from: /value:"diego"/g, to: 'value:"padrao"' },
      { from: /children:"Diego"/g, to: 'children:"Padrão"' },
      { from: /dgflow-full-export/g, to: 'tennoflow-full-export' },
      { from: /Usar dgflow-full-export\.json/g, to: 'Usar exportação Tenno' }
    ]
  },
  {
    file: 'BioEditor-aWhG8OhX.js',
    replaces: [
      { from: /dgflow\.app\/bio\//g, to: 'tennoflow.com.br/bio/' }
    ]
  },
  {
    file: 'BioLink-D9FXCSZs.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app/g, to: 'https://tennoflow.com.br' }
    ]
  },
  {
    file: 'BrandingConfigSection-BugsCdIQ.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app/g, to: 'https://tennoflow.com.br' }
    ]
  },
  {
    file: 'ClientAccessDialog-BMjfwW40.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app\/aprovacao\//g, to: 'https://tennoflow.com.br/aprovacao/' }
    ]
  },
  {
    file: 'ContentCalendar-ABQSUhAP.js',
    replaces: [
      { from: /return"https:\/\/dgflow\.vercel\.app"/g, to: 'return"https://tennoflow.com.br"' }
    ]
  },
  {
    file: 'ContentItemFullDialog-CX7fuwxD.js',
    replaces: [
      { from: /let d="https:\/\/dgflow\.vercel\.app"/g, to: 'let d="https://tennoflow.com.br"' },
      { from: /let i="https:\/\/dgflow\.vercel\.app"/g, to: 'let i="https://tennoflow.com.br"' }
    ]
  },
  {
    file: 'MyLinksSection-BDPKzdoO.js',
    replaces: [
      { from: /"dgflow\.vercel\.app"/g, to: '"tennoflow.com.br"' }
    ]
  },
  {
    file: 'Nps-tbbuq_2H.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app/g, to: 'https://tennoflow.com.br' }
    ]
  },
  {
    file: 'Portfolio-DkyfEyB2.js',
    replaces: [
      { from: /dgflow\.app\/p\//g, to: 'tennoflow.com.br/p/' },
      { from: /dgflow\.vercel\.app\/p\//g, to: 'tennoflow.com.br/p/' },
      { from: /dgflow\.vercel\.app\/bio\//g, to: 'tennoflow.com.br/bio/' },
      { from: /https:\/\/dgflow\.vercel\.app/g, to: 'https://tennoflow.com.br' }
    ]
  },
  {
    file: 'ProductivityReport-tek3ToHk.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app/g, to: 'https://tennoflow.com.br' }
    ]
  },
  {
    file: 'PublicBriefing-1C691_Xk.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app/g, to: 'https://tennoflow.com.br' }
    ]
  },
  {
    file: 'PublicForm-Cnb7uYNV.js',
    replaces: [
      { from: /https:\/\/dgflow\.app/g, to: 'https://tennoflow.com.br' }
    ]
  },
  {
    file: 'PublicPortfolio-D9FgMl1L.js',
    replaces: [
      { from: /https:\/\/dgflow\.app/g, to: 'https://tennoflow.com.br' }
    ]
  },
  {
    file: 'QuoteRequest-Cu8suypM.js',
    replaces: [
      { from: /baseUrl:"https:\/\/dgflow\.app"/g, to: 'baseUrl:"https://tennoflow.com.br"' }
    ]
  },
  {
    file: 'Quotes-DPV34c1_.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app/g, to: 'https://tennoflow.com.br' },
      { from: /https:\/\/dgflow\.app\/contract\//g, to: 'https://tennoflow.com.br/contract/' }
    ]
  },
  {
    file: 'SendApprovalLinkDialog-CSns80dF.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app\/aprovacao\//g, to: 'https://tennoflow.com.br/aprovacao/' }
    ]
  },
  {
    file: 'Services-CinVTd9c.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app\/planos\//g, to: 'https://tennoflow.com.br/planos/' },
      { from: /children:"dgflow\.vercel\.app\/planos\/"/g, to: 'children:"tennoflow.com.br/planos/"' }
    ]
  },
  {
    file: 'Settings-C70Pkd1T.js',
    replaces: [
      { from: /children:"DGFLOW"/g, to: 'children:"TENNO FLOW"' }
    ]
  },
  {
    file: 'Setup-8drIwsw9.js',
    replaces: [
      { from: /children:"dgflow\.vercel\.app\/p\/"/g, to: 'children:"tennoflow.com.br/p/"' },
      { from: /children:\["dgflow\.vercel\.app\/p\/",/g, to: 'children:["tennoflow.com.br/p/",' }
    ]
  },
  {
    file: 'shareLinks-C6QAEuXx.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app/g, to: 'https://tennoflow.com.br' }
    ]
  },
  {
    file: 'TestimonialsLp3-kBU7aBED.js',
    replaces: [
      { from: /app\.dgflow\.vercel\.app\/producao/g, to: 'app.tennoflow.com.br/producao' }
    ]
  },
  {
    file: 'useCustomDomain-BegtEA37.js',
    replaces: [
      { from: /https:\/\/dgflow\.vercel\.app/g, to: 'https://tennoflow.com.br' }
    ]
  },
  {
    file: 'useUpgradeCalculation-C14KDz0_.js',
    replaces: [
      { from: /"Amanda","Diego","Bianca"/g, to: '"Amanda","Lucas","Bianca"' }
    ]
  },
  {
    file: 'WhatsAppSettingsPanel-Dio4ooZ1.js',
    replaces: [
      { from: /dgflow\.vercel\.app\/p\//g, to: 'tennoflow.com.br/p/' },
      { from: /dgflow\.vercel\.app\/tasks\//g, to: 'tennoflow.com.br/tasks/' },
      { from: /dgflow\.vercel\.app\/a\//g, to: 'tennoflow.com.br/a/' },
      { from: /dgflow\.vercel\.app\/post\//g, to: 'tennoflow.com.br/post/' }
    ]
  }
];

let totalFixed = 0;

for (const item of fileReplacements) {
  const full = path.join(assetsDir, item.file);
  if (!fs.existsSync(full)) {
    console.log(`[SKIP] Not found: ${item.file}`);
    continue;
  }
  let content = fs.readFileSync(full, 'utf8');
  let original = content;

  for (const rep of item.replaces) {
    content = content.replace(rep.from, rep.to);
  }

  if (content !== original) {
    fs.writeFileSync(full, content, 'utf8');
    // Check syntax
    try {
      execSync(`node --check "${full}"`);
      console.log(`[OK] Sanitized & verified: ${item.file}`);
      totalFixed++;
    } catch (e) {
      console.error(`[ERROR] Syntax error in ${item.file}:`, e.message);
      fs.writeFileSync(full, original, 'utf8'); // Revert
    }
  } else {
    console.log(`[NO-OP] No matches in: ${item.file}`);
  }
}

console.log(`\nDone sanitizing ${totalFixed} files.`);
