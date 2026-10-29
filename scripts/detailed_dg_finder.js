const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const ignoreDirs = new Set(['node_modules', '.next', '.git']);

const matches = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoreDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!['.js', '.html', '.ts', '.tsx', '.json', '.sql'].includes(ext)) continue;
      if (entry.name.includes('detailed_dg_finder') || entry.name.includes('audit_report')) continue;
      
      const content = fs.readFileSync(fullPath, 'utf8');
      const relPath = path.relative(rootDir, fullPath);

      // Regex for dg or diego
      const regex = /(?:dgflow|dg[_\s-]flow|dgdireto|diego)/gi;
      let m;
      while ((m = regex.exec(content)) !== null) {
        const start = Math.max(0, m.index - 40);
        const end = Math.min(content.length, m.index + 50);
        matches.push({
          file: relPath,
          match: m[0],
          snippet: content.substring(start, end).replace(/\s+/g, ' ')
        });
      }
    }
  }
}

walk(rootDir);

console.log(`Total occurrences: ${matches.length}`);
fs.writeFileSync(path.join(__dirname, 'detailed_matches.json'), JSON.stringify(matches, null, 2), 'utf8');
