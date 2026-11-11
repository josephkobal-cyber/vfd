#!/usr/bin/env node
/*
 * Export final articles (Markdown with front matter) to Word for the CMS.
 *
 *   node tools/export-docx.js content/blog/final/*.md
 *
 * Each .docx holds the article, then a "Publishing metadata" table and the
 * JSON-LD schema block. Needs pandoc.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const checker = require('./article-checker/checker-core.js');

const files = process.argv.slice(2);
if (!files.length) { console.error('Usage: node tools/export-docx.js <article.md> [...]'); process.exit(2); }

const LABELS = [
  ['seo_title', 'SEO title'], ['meta_description', 'Meta description'], ['slug', 'URL slug'],
  ['primary_keyword', 'Primary keyword'], ['primary_question', 'Primary target question'],
  ['related_queries', 'Related queries'], ['author', 'Author'], ['author_title', 'Author title'],
  ['publisher', 'Publisher'], ['date_published', 'Date published'], ['date_modified', 'Last updated'],
  ['ai_answer_summary', 'AI answer summary']
];
const cell = (v) => String(Array.isArray(v) ? v.join('; ') : v || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const body = src.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
  const report = checker.check(src);
  const meta = report.meta;
  const rows = LABELS.map(([k, label]) => '| ' + label + ' | ' + cell(meta[k]) + ' |').join('\n');
  const md = body.trim() + '\n\n## Publishing metadata\n\n| Field | Value |\n|---|---|\n' + rows +
    '\n\n## Schema (JSON-LD)\n\nPaste into the page head.\n\n```html\n<script type="application/ld+json">\n' +
    JSON.stringify(report.schema, null, 2) + '\n</script>\n```\n';
  const out = file.replace(/\.md$/i, '.docx');
  execFileSync('pandoc', ['-f', 'gfm-tex_math_dollars', '-o', out], { input: md });
  console.log(path.basename(out) + ': ' + report.verdict + ' (' + report.score + '/100)');
}
