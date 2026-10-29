import fs from 'fs';

const content = fs.readFileSync('C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js', 'utf8');

const idx = content.indexOf('infinitepay-create-charge');
if (idx !== -1) {
  console.log('Interceptor snippet:');
  console.log(content.slice(Math.max(0, idx - 200), Math.min(content.length, idx + 800)));
} else {
  console.log('infinitepay-create-charge not found in index-G-E061gt.js');
}
