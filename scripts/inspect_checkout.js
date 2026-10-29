import fs from 'fs';
import path from 'path';

const projectRoot = 'C:/Users/gui14/Projects/dgflow/public/assets';

const files = [
  'Checkout-2v9cVefV.js',
  'CheckoutLP-lsHKpegk.js',
  'Subscription-DN9coBP-.js'
];

for (const f of files) {
  const full = path.join(projectRoot, f);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, 'utf8');
  console.log(`\n=== ${f} ===`);
  const matches = [...content.matchAll(/(.{0,100}(?:checkout|subscribe|assinatura|plano|gateway|pagarme|asaas|infinitepay).{0,100})/gi)];
  matches.slice(0, 5).forEach(m => console.log('  ->', m[0].trim()));
}
