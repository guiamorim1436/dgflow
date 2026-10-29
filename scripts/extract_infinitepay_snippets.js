import fs from 'fs';
import path from 'path';

const projectRoot = 'C:/Users/gui14/Projects/dgflow/public/assets';

const files = [
  'GatewaySelector-C26Qko5F.js',
  'Settings-C70Pkd1T.js',
  'QuickTransactionDialog-BcTmWgXR.js',
  'Quotes-DPV34c1_.js'
];

for (const f of files) {
  const full = path.join(projectRoot, f);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, 'utf8');
  console.log(`\n=== ${f} ===`);
  const matches = [...content.matchAll(/(.{0,100}infinitepay.{0,150})/gi)];
  matches.slice(0, 5).forEach(m => console.log('  ->', m[0].trim()));
}
