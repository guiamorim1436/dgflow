const fs = require('fs');
const path = require('path');

const matches = JSON.parse(fs.readFileSync(path.join(__dirname, 'detailed_matches.json'), 'utf8'));

const filesMap = {};

for (const m of matches) {
  if (!filesMap[m.file]) {
    filesMap[m.file] = [];
  }
  filesMap[m.file].push(m);
}

console.log('--- FILES AND MATCH COUNTS ---');
for (const [file, list] of Object.entries(filesMap)) {
  console.log(`${file}: ${list.length}`);
}

const uiMatches = matches.filter(m => {
  return /app\.dgflow|dgflow\.app|dgflow\.vercel|dgdireto|diego|contato@dgflow|dgflow_welcome|dg flow/i.test(m.snippet);
});

console.log(`\nUI-relevant matches: ${uiMatches.length}`);
fs.writeFileSync(path.join(__dirname, 'ui_matches.json'), JSON.stringify(uiMatches, null, 2), 'utf8');
