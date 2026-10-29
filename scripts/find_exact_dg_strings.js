import fs from 'fs';
import path from 'path';

const projectRoot = 'C:/Users/gui14/Projects/dgflow/public/assets';

const files = fs.readdirSync(projectRoot).filter(f => f.endsWith('.js') || f.endsWith('.html'));

const found = [];

for (const f of files) {
  const full = path.join(projectRoot, f);
  const content = fs.readFileSync(full, 'utf8');

  // Match dgflow (case insensitive), diego (case insensitive)
  const matches = [...content.matchAll(/([^\w]|^)(dgflow|diego)([^\w]|$)/gi)];
  if (matches.length > 0) {
    // Collect snippets
    const snippets = matches.map(m => {
      const idx = m.index;
      const start = Math.max(0, idx - 40);
      const end = Math.min(content.length, idx + 50);
      return content.slice(start, end).replace(/\n/g, ' ');
    });
    found.push({ file: f, count: matches.length, snippets });
  }
}

console.log(`Found ${found.length} files with exact dgflow / diego references:`);
found.forEach(item => {
  console.log(`\n--- ${item.file} (${item.count} hits) ---`);
  item.snippets.slice(0, 10).forEach(s => console.log('  *', s));
});
