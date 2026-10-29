const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'Settings-C70Pkd1T.js'), 'utf8');

// Find Ti component definition
const idx = content.indexOf('user_infinitepay_config');
if (idx !== -1) {
  console.log(content.substring(Math.max(0, idx - 500), Math.min(content.length, idx + 1000)));
}
