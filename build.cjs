'use strict';
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
let page = read('index.html');
page = page.replace('<link rel="stylesheet" href="style.css">', () => '<style>\n' + read('style.css') + '\n</style>');
for (const file of ['calculator.js', 'app.js']) {
  page = page.replace(`<script defer src="${file}"></script>`, '');
  page = page.replace('</body>', () => `<script>\n${read(file)}\n</script>\n</body>`);
}
if (/src="(?:calculator|app)\.js"|href="style\.css"/.test(page)) throw new Error('Standalone asset bundling failed');
fs.writeFileSync(path.join(__dirname, 'Token-Ledger.html'), page);
console.log(`Built standalone Token-Ledger.html (${Buffer.byteLength(page)} bytes)`);
