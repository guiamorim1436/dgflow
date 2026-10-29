const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'Settings-C70Pkd1T.js'), 'utf8');

const regex = /infinitepay|mercadopago|asaas/gi;
let m;
while ((m = regex.exec(content)) !== null) {
  const start = Math.max(0, m.index - 60);
  const end = Math.min(content.length, m.index + 80);
  console.log(content.substring(start, end).replace(/\s+/g, ' '));
}
