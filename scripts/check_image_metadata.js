const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
const previewFiles = [
  'leads-preview-8OCAfRuv.png',
  'landing-page-preview-B0zFXjta.png',
  'client-portal-preview-BhiOYWtK.webp',
  'clients-preview-Dz_P91aA.webp',
  'content-preview-C8lyu3ta.webp',
  'finance-billing-preview-CM9k_C2v.webp',
  'team-permissions-preview-CQ6Hh0sB.webp',
  'whatsapp-preview-DDEhdpdZ.webp',
  'ai-designer-preview-BsYyuxgD.webp',
  'ig-comment-1-DtXDiXJm.webp',
  'ig-comment-2-ChDY9gTU.webp',
  'ig-comment-3-Do-nKsOk.webp',
  'wpp-claude-1-qFe8zUrj.webp',
  'wpp-claude-2-pE5VEO4Z.webp'
];

for (const file of previewFiles) {
  const p = path.join(assetsDir, file);
  if (!fs.existsSync(p)) {
    console.log(`${file}: NOT FOUND`);
    continue;
  }
  const buf = fs.readFileSync(p);
  const str = buf.toString('latin1');
  const dgMatches = str.match(/dgflow|diego|dg/gi) || [];
  console.log(`${file} (${(buf.length/1024).toFixed(1)} KB): binary strings matching dg/diego: ${dgMatches.length}`);
}
