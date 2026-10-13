'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const checks = [];
function check(name, fn) { fn(); checks.push(name); console.log('PASS ' + name); }
check('Chinese language and responsive viewport declared', () => { assert.match(html, /lang="zh-CN"/); assert.match(html, /name="viewport"/); });
check('No duplicate static IDs', () => { const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]); assert.equal(new Set(ids).size, ids.length); });
check('Referenced local assets exist', () => { for (const [, file] of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)) assert.ok(fs.existsSync(path.join(__dirname, file)), file); });
check('No third-party assets or network requests in application', () => { assert.doesNotMatch(html, /(?:src|href)="https?:/); assert.doesNotMatch(app, /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/); });
check('Keyboard skip navigation and focus styles provided', () => { assert.match(html, /class="skip-link" href="#workspace"/); assert.match(css, /:focus-visible/); });
check('Inputs have labels, error associations and invalid state handling', () => { assert.match(app, /<label for=/); assert.match(app, /aria-describedby=/); assert.match(app, /setAttribute\('aria-invalid', 'true'\)/); });
check('User-entered model names render through textContent', () => { assert.match(app, /\$\('bar-' \+ i \+ '-name'\)\.textContent/); });
check('Reduced-motion and narrow-screen rules present', () => { assert.match(css, /prefers-reduced-motion/); assert.match(css, /max-width:580px/); });
check('Pricing assumptions and excluded fees visible in document', () => { assert.match(html, /示例价格，不是实时行情/); assert.match(html, /所有金额均为 USD/); assert.match(html, /每百万 token/); assert.match(html, /缓存写入、工具调用、存储、税费/); });
console.log(`${checks.length} static checks passed. These checks do not replace browser, accessibility-tree, or visual testing.`);
