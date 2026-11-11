#!/usr/bin/env node
/*
 * Refresh the list of live Virtual Front Desk pages the checker accepts as
 * link targets, from the website and help center sitemaps.
 *
 *   node tools/article-checker/refresh-known-pages.js && node tools/article-checker/build.js
 *
 * Run it after new blog posts are published, so articles may link to them.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SITEMAPS = ['https://www.virtualfrontdesk.com/sitemap.xml', 'https://help.virtualfrontdesk.com/sitemap.xml'];

const urls = new Set();
for (const map of SITEMAPS) {
  const xml = execFileSync('curl', ['-sSL', '--max-time', '30', map], { encoding: 'utf8' });
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const u = m[1].trim().replace(/\/+$/, '');
    // Help center: English pages only.
    if (/help\.virtualfrontdesk\.com/.test(u) && !/\/en(\/|$)/.test(u)) continue;
    urls.add(u);
  }
}
if (urls.size < 20) { console.error('Only ' + urls.size + ' URLs found. Sitemaps unreachable? Nothing changed.'); process.exit(1); }

const file = path.join(__dirname, 'checker-core.js');
const src = fs.readFileSync(file, 'utf8');
const list = JSON.stringify([...urls].sort(), null, 4).replace(/\n/g, '\n  ');
const next = src.replace(/(\/\/ KNOWN_PAGES:start[^\n]*\n)[\s\S]*?(\n\s*\/\/ KNOWN_PAGES:end)/, '$1  var KNOWN_PAGES = ' + list + ';$2');
fs.writeFileSync(file, next);
console.log('Saved ' + urls.size + ' live pages to checker-core.js');
