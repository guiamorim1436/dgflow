const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'public', 'assets');

const files = fs.readdirSync(assetsDir);
const matches = [];

for (const f of files) {
  if (!f.endsWith('.js')) continue;
  const fullPath = path.join(assetsDir, f);
  const content = fs.readFileSync(fullPath, 'utf8');

  if (/checkout|plan_link|infinitepay|assinar|pagamento/i.test(content) && /enterprise|starter|pro|business/i.test(content)) {
    matches.push(f);
  }
}

console.log('Subscription-related files:', matches);
