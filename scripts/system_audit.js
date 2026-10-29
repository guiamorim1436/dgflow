const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const ignoreDirs = new Set(['node_modules', '.next', '.git']);
const textExtensions = new Set(['.js', '.html', '.json', '.css', '.ts', '.tsx', '.sql', '.md', '.webmanifest']);
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']);

const results = {
  dgReferences: [],
  diegoReferences: [],
  imageFiles: [],
  dgImages: []
};

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoreDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      const relPath = path.relative(rootDir, fullPath);

      if (imageExtensions.has(ext)) {
        results.imageFiles.push(relPath);
        if (/dg|diego/i.test(entry.name)) {
          results.dgImages.push(relPath);
        }
      }

      if (textExtensions.has(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Match dgflow or dg flow (case-insensitive)
          const dgMatches = [...content.matchAll(/(?:dgflow|dg[_\s-]flow|dgdireto)/gi)];
          if (dgMatches.length > 0) {
            results.dgReferences.push({
              file: relPath,
              count: dgMatches.length,
              samples: dgMatches.slice(0, 5).map(m => {
                const start = Math.max(0, m.index - 30);
                const end = Math.min(content.length, m.index + 40);
                return content.substring(start, end).replace(/\n/g, ' ');
              })
            });
          }

          // Match diego (case-insensitive)
          const diegoMatches = [...content.matchAll(/diego/gi)];
          if (diegoMatches.length > 0) {
            results.diegoReferences.push({
              file: relPath,
              count: diegoMatches.length,
              samples: diegoMatches.slice(0, 5).map(m => {
                const start = Math.max(0, m.index - 30);
                const end = Math.min(content.length, m.index + 40);
                return content.substring(start, end).replace(/\n/g, ' ');
              })
            });
          }
        } catch (err) {
          // Ignore unreadable binary
        }
      }
    }
  }
}

walk(rootDir);

const reportPath = path.join(__dirname, 'audit_report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
console.log(`Scan completed. Found ${results.dgReferences.length} files with DG, ${results.diegoReferences.length} with Diego, ${results.dgImages.length} images matching names.`);
