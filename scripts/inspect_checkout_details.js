const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'Checkout-2v9cVefV.js'), 'utf8');

// Find where functions.invoke is called
const idx = content.indexOf('functions.invoke');
if (idx !== -1) {
  console.log(content.substring(Math.max(0, idx - 400), Math.min(content.length, idx + 1200)));
}
