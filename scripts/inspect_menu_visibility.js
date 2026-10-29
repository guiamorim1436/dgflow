import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/useProductionCounterVisibility-DrP2o-XX.js', 'utf8');
console.log('useProductionCounterVisibility content:');
console.log(content.slice(0, 2000));
