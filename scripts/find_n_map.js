import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/AppLayout-DQCqTAe0.js', 'utf8');

const matches = [...content.matchAll(/N\.map\(/g)];
console.log('N.map matches:', matches.length);
if (matches.length > 0) {
  const idx = matches[0].index;
  console.log(content.slice(idx - 100, idx + 1000));
} else {
  // Let's search f.map
  const matchesF = [...content.matchAll(/f\.map\(/g)];
  console.log('f.map matches:', matchesF.length);
  if (matchesF.length > 0) {
    const idx = matchesF[0].index;
    console.log(content.slice(idx - 100, idx + 1000));
  }
}
