#!/usr/bin/env node
/*
 * Command-line runner for the Virtual Front Desk article checker.
 *
 *   node tools/article-checker/cli.js article.md            # readable report
 *   node tools/article-checker/cli.js article.md --json     # full JSON report
 *   node tools/article-checker/cli.js article.md --schema   # JSON-LD only
 *   node tools/article-checker/cli.js a.md b.md c.md         # several files
 *
 * Reads Markdown (with YAML front matter). A .docx is converted with pandoc
 * first when pandoc is installed; the web checker reads .docx directly.
 * Exit code: 0 when every file is "Ready to publish", 1 otherwise.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const checker = require('./checker-core.js');

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const files = args.filter((a) => !a.startsWith('--'));
if (!files.length) {
  console.error('Usage: node cli.js <article.md|article.docx> [...] [--json|--schema|--all]');
  process.exit(2);
}

function load(file) {
  if (/\.docx$/i.test(file)) {
    try {
      return execFileSync('pandoc', [file, '-t', 'gfm', '--wrap=none'], { encoding: 'utf8' });
    } catch (e) {
      throw new Error('Reading .docx needs pandoc. Use the web checker or convert to Markdown first.');
    }
  }
  return fs.readFileSync(file, 'utf8');
}

const icon = { pass: '✔', warn: '▲', fail: '✖' };
let allReady = true;

for (const file of files) {
  const report = checker.check(load(file));
  if (report.verdict !== 'Ready to publish') allReady = false;
  if (flags.has('--json')) { console.log(JSON.stringify(report, null, 2)); continue; }
  if (flags.has('--schema')) {
    console.log('<script type="application/ld+json">\n' + JSON.stringify(report.schema, null, 2) + '\n</script>');
    continue;
  }
  const s = report.stats;
  console.log('\n' + path.basename(file));
  console.log('  ' + report.verdict.toUpperCase() + ' · score ' + report.score + '/100 · ' + report.fails + ' fail, ' + report.warnings + ' warn, ' + report.passes + ' pass');
  console.log('  ' + s.words + ' words · ' + s.sections + ' sections · ' + s.faq + ' FAQs · Flesch ' + s.flesch + ' · ' + s.avgSentence + ' words/sentence · ' + s.links + ' links');
  for (const cat of report.categories) {
    const shown = cat.checks.filter((c) => flags.has('--all') || c.status !== 'pass');
    if (!shown.length) continue;
    console.log('  ' + cat.name);
    for (const c of shown) {
      console.log('    ' + icon[c.status] + ' ' + c.label + ': ' + c.detail);
      c.items.slice(0, 8).forEach((i) => console.log('        - ' + i));
      if (c.status !== 'pass' && c.fix) console.log('        fix: ' + c.fix);
    }
  }
}
process.exit(allReady ? 0 : 1);
