import sharp from 'sharp';
import fs from 'fs';

async function patchWppClaude2() {
  const filePath = 'C:/Users/gui14/Projects/dgflow/public/assets/wpp-claude-2-pE5VEO4Z.webp';
  const fileBuf = fs.readFileSync(filePath);
  const metadata = await sharp(fileBuf).metadata();
  console.log('wpp-claude-2 size:', metadata.width, metadata.height);

  const svg = `
  <svg width="${metadata.width}" height="${metadata.height}">
    <!-- Clean DGFLOW text row -->
    <rect x="250" y="775" width="220" height="26" fill="#1f2c34" />
    <text x="255" y="794" fill="#e9edef" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="18px" font-weight="500">Tenno Flow,</text>
    
    <!-- Cover avatar/thumbnail inside bubble 3 with a clean abstract gradient icon -->
    <rect x="118" y="760" width="46" height="58" rx="6" fill="#128c7e" />
    <text x="141" y="796" fill="#ffffff" font-family="sans-serif" font-size="22px" font-weight="bold" text-anchor="middle">⚡</text>
  </svg>
  `;

  const updatedBuffer = await sharp(fileBuf)
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 }
    ])
    .webp({ quality: 95 })
    .toBuffer();

  const tempPath = 'C:/Users/gui14/Projects/dgflow/public/assets/wpp-claude-2-temp.webp';
  fs.writeFileSync(tempPath, updatedBuffer);
  fs.copyFileSync(tempPath, filePath);
  fs.unlinkSync(tempPath);
  console.log('Successfully patched wpp-claude-2-pE5VEO4Z.webp');
}

patchWppClaude2().catch(console.error);
