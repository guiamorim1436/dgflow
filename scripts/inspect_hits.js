import fs from 'fs';
import path from 'path';

const projectRoot = 'C:/Users/gui14/Projects/dgflow';

const sampleFiles = [
  'public/assets/DgflowAgentChat-CY2JIZnE.js',
  'public/assets/TestimonialsLp3-kBU7aBED.js',
  'public/assets/Lp5-Bmf2YPzW.js',
  'public/assets/Finance-BXfZwaU4.js',
  'public/assets/Setup-8drIwsw9.js',
  'public/assets/useSeoMeta-CAtnSB4Y.js',
  'public/assets/index-G-E061gt.js'
];

for (const rel of sampleFiles) {
  const full = path.join(projectRoot, rel);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, 'utf8');
  const matches = [...content.matchAll(/(.{0,40}(?:dgflow|diego|dg).{0,40})/gi)];
  console.log(`=== ${rel} ===`);
  matches.slice(0, 5).forEach(m => console.log('  ->', m[0].trim()));
}
