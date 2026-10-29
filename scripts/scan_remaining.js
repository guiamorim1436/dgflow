import fs from 'fs';
import path from 'path';

const projectRoot = 'C:/Users/gui14/Projects/dgflow';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === '.next' || file === 'scripts') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = walk(projectRoot);
console.log(`Scanning ${allFiles.length} files...`);

const targetPatterns = [
  /dgflow/i,
  /diego\s+brandão/i,
  /\bdg\b/i
];

let hits = [];

for (const file of allFiles) {
  // Only text files
  if (!/\.(js|jsx|ts|tsx|html|json|md|sql)$/i.test(file)) continue;
  if (file.includes('package-lock.json')) continue;
  
  const content = fs.readFileSync(file, 'utf8');
  let fileHits = 0;
  for (const pat of targetPatterns) {
    const matches = content.match(pat);
    if (matches) {
      fileHits += matches.length;
    }
  }
  if (fileHits > 0) {
    hits.push({ file: path.relative(projectRoot, file), hits: fileHits });
  }
}

console.log('Files with hits:', JSON.stringify(hits, null, 2));
