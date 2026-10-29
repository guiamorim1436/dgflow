import fs from 'fs';
import { execSync } from 'child_process';

const filePath = 'C:/Users/gui14/Projects/dgflow/public/assets/useProductionCounterVisibility-DrP2o-XX.js';
let content = fs.readFileSync(filePath, 'utf8');

// Ensure that menu hidden is completely cleaned if corrupted
const target = 'b();const f=["/dashboard","/settings"]';
const replacement = 'try{localStorage.removeItem("dgflow_menu_hidden");localStorage.removeItem("tennoflow_menu_hidden")}catch(_){}b();const f=["/dashboard","/settings"]';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  execSync(`node --check "${filePath}"`);
  console.log('Successfully updated useProductionCounterVisibility-DrP2o-XX.js!');
} else {
  console.log('Target not found in useProductionCounterVisibility');
}
