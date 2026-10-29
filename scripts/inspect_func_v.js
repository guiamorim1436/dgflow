import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/useProductionCounterVisibility-DrP2o-XX.js', 'utf8');

// Check the function V (filter function)
const idx = content.indexOf('V=(r,t)=>r.filter');
if (idx !== -1) {
  console.log('Function V snippet:');
  console.log(content.slice(idx, idx + 400));
}
