import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

const target = '_infInit=((orig)=>{ie.functions.invoke=async(fnName,opts={})=>{if(fnName==="infinitepay-create-charge"){';
const idx = content.indexOf(target);
console.log('Target found at index:', idx);

if (idx !== -1) {
  const snippet = content.slice(idx, idx + 600);
  console.log('Current interceptor implementation:\n', snippet);
}
