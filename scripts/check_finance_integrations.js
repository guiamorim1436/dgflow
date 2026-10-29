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
      
      const content = fs.readFileSync(fullPath, 'utf8');
      const relPath = path.relative(rootDir, fullPath);

      const regex = /(?:infinitepay|infinite[_\s-]pay|asaas|pagarme|mercadopago|abacatepay|subscription|checkout)/gi;
      let m;
      let count = 0;
      while ((m = regex.exec(content)) !== null && count < 5) {
        if (/infinitepay|infinite[_\s-]pay/i.test(m[0])) {
          const start = Math.max(0, m.index - 50);
          const end = Math.min(content.length, m.index + 80);
          matches.push({
            file: relPath,
            match: m[0],
            snippet: content.substring(start, end).replace(/\s+/g, ' ')
          });
          count++;
        }
      }
    }
  }
}

walk(rootDir);

console.log(`Found ${matches.length} InfinitePay references`);
fs.writeFileSync(path.join(__dirname, 'infinitepay_matches.json'), JSON.stringify(matches, null, 2), 'utf8');
