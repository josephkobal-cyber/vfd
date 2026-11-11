#!/usr/bin/env node
/*
 * Builds the single-file checker page from app.html + checker-core.js and
 * an example article.
 *
 *   node tools/article-checker/build.js
 *
 * Writes:
 *   tools/article-checker/dist/article-checker.html  page body for the Artifact publish
 *   tools/article-checker/index.html                 same page with a full HTML skeleton, to open locally
 */
'use strict';
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const repo = path.resolve(dir, '..', '..');
const sampleFile = path.join(repo, 'content', 'blog', 'final', '02-qr-code-visitor-sign-in.md');

const core = fs.readFileSync(path.join(dir, 'checker-core.js'), 'utf8');
const sample = fs.readFileSync(sampleFile, 'utf8');
const app = fs.readFileSync(path.join(dir, 'app.html'), 'utf8');

// JSON strings are valid JS; escape "</" so the sample can't close the script tag.
const js = (s) => JSON.stringify(s).replace(/<\//g, '<\\/');
const page = app
  .replace('/*__CHECKER_CORE__*/', () => core.replace(/<\/script/gi, '<\\/script'))
  .replace("/*__SAMPLE_NAME__*/''", () => js(path.basename(sampleFile)))
  .replace("/*__SAMPLE__*/''", () => js(sample));

fs.mkdirSync(path.join(dir, 'dist'), { recursive: true });
fs.writeFileSync(path.join(dir, 'dist', 'article-checker.html'), page);
fs.writeFileSync(
  path.join(dir, 'index.html'),
  '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n' + page + '\n</body>\n</html>\n'
);
console.log('Built dist/article-checker.html and index.html (' + Math.round(page.length / 1024) + ' KB)');
