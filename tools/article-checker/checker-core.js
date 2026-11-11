/*
 * Virtual Front Desk article checker: rule engine.
 *
 * Works in the browser (window.VFDChecker) and in Node (require).
 * Input: a parsed document { meta, blocks, trailing } built by
 * parseMarkdown() or parseHtml(). Output: a report with a score, a verdict
 * and every check grouped by category.
 *
 * The rules mirror .claude/skills/vfd-blog-writer/references/article-spec.md.
 * Change both together.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.VFDChecker = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

  var BRAND = 'Virtual Front Desk';

  var LIMITS = {
    words: [1200, 2200], wordsHard: [900, 3000],
    h1: [30, 80],
    h2: [5, 12],
    intro: [40, 100],
    section: [40, 400],
    paragraphWarn: 100, paragraphFail: 130,
    faq: [4, 8], faqAnswer: [20, 100],
    seoTitle: [30, 60],
    meta: [120, 160],
    slugMax: 75,
    summary: [40, 90],
    density: [0.3, 2.5],
    flesch: [45, 35],
    avgSentence: [11, 22],
    longSentencePct: [10, 20],
    burstiness: 5,
    contractionsPer1k: 3,
    youPer1k: 8,
    passivePct: [15, 25],
    brandMentions: 5,
    facts: 8,
    internalLinks: 3,
    relatedQueries: 5
  };

  // Hard-banned: reads as machine-written or hype. Any hit fails the check.
  var BANNED_HARD = [
    'delve', 'delves', 'delving', 'leverage', 'leverages', 'leveraging', 'unlock', 'unlocks', 'unlocking',
    'unleash', 'elevate', 'elevates', 'empower', 'empowers', 'empowering', 'revolutionize', 'revolutionizes',
    'revolutionary', 'supercharge', 'game-changer', 'game changer', 'game-changing', 'cutting-edge',
    'state-of-the-art', 'best-in-class', 'world-class', 'next-level', 'seamless', 'seamlessly', 'synergy',
    'paradigm', 'tapestry', 'ever-evolving', 'testament to', 'in today\'s fast-paced', 'in today\'s world',
    'in the modern workplace', 'it\'s important to note', 'it is important to note', 'it\'s worth noting',
    'it is worth noting', 'let\'s dive in', 'dive into', 'deep dive', 'in conclusion', 'to sum up',
    'at the end of the day', 'look no further', 'whether you\'re a', 'navigate the complexities',
    'in the realm of', 'harness the power', 'take it to the next level', 'embark'
  ];
  // Soft: allowed occasionally, flagged as a warning.
  var BANNED_SOFT = [
    'robust', 'holistic', 'streamline', 'streamlines', 'streamlined', 'transformative', 'innovative',
    'when it comes to', 'landscape', 'realm', 'myriad', 'plethora', 'foster', 'bolster', 'utilize',
    'utilizes', 'facilitate', 'facilitates', 'comprehensive', 'crucial', 'pivotal', 'vital', 'effortless',
    'effortlessly', 'hassle-free', 'peace of mind'
  ];
  var STIFF_STARTERS = ['moreover', 'furthermore', 'additionally', 'consequently', 'thus', 'hence', 'therefore', 'in addition', 'notably', 'importantly', 'ultimately'];
  var THROAT_CLEARING = /^(in today'?s|in the (modern|current|digital)|have you ever|imagine|picture this|when it comes to|are you|did you know|as (a|an) [a-z]+ (manager|leader)|in an era|nowadays|these days)/i;
  var WEAK_ANCHORS = /^(click here|here|this link|link|read more|learn more|more|this|this page|this article|website)$/i;

  var CONTRACTIONS = /\b\w+(n't|'re|'ve|'ll|'d|'m)\b|\b(it's|that's|there's|here's|what's|who's|let's|you're|we're|they're|isn't|aren't|don't|doesn't|didn't|won't|can't|wouldn't|shouldn't|couldn't|hasn't|haven't|wasn't|weren't)\b/gi;
  var YOU = /\b(you|your|yours|yourself)\b/gi;
  var PASSIVE = /\b(am|is|are|was|were|be|been|being|gets|got|get)\s+(\w+ly\s+)?(\w+ed|known|shown|given|taken|made|sent|built|done|seen|kept|held|set|paid|told|found|left|written|run|brought|put|read|chosen|drawn|grown|thrown|hidden|stored|shared|printed|signed|issued)\b/i;

  // Facts that are easy to get wrong. Each rule has a pattern and a message.
  var FACT_FAILS = [
    { re: /SOC\s?2\s+Type\s+(II|2)\b/i, msg: 'Virtual Front Desk is SOC 2 Type I certified. Type II is Microsoft Azure\'s certification, not Virtual Front Desk\'s.' },
    { re: /\bHIPAA[- ](compliant|compliance|certified|certification)\b/i, msg: '"HIPAA compliant" is not a verified claim for Virtual Front Desk. Say sign-in data is encrypted in transit and at rest on Microsoft Azure with role-based access.' },
    { re: /\b(ISO\s?27001|ISO\/IEC 27001)[- ]certified\b/i, msg: 'The security program is aligned with ISO/IEC 27001, not certified.' },
    { re: /\bHead of Customer Success\b/i, msg: 'Jeff Letendre is CEO and Founder, not Head of Customer Success.' }
  ];
  var FACT_WARNS = [
    { re: /\btrain(s|ed|ing)?\s+(its|our|the)\s+(AI|models?)\s+on\b/i, msg: 'The "no training on customer data" claim is not in the help center. Confirm with the product team before publishing.' },
    { re: /\b(answer|answered|answering|take|pick up)\b[^.]{0,40}\b(in|from|via|through)\s+Slack\b/i, msg: 'The help center says Slack sends a notification only. WhatsApp is the integration with a video-call link.' },
    { re: /\bbroadcast\b[^.]{0,80}\bTeams\b/i, skip: /\b(not|isn't|unavailable|no|never|can't)\b/i, msg: 'Broadcast mode is not available for groups with Microsoft Teams users. Check the wording.' },
    { re: /\bwithout a (Teams Phone )?license\b[^.]{0,60}\bphone number\b|\bphone number\b[^.]{0,60}\bwithout a (Teams Phone )?license\b/i, msg: 'Answering a phone number in Teams without a Teams Phone license is not confirmed in the help center.' },
    { re: /\bfree forever\b|\bno credit card\b/i, msg: 'The free trial starts after a credit card is added in billing. Check the wording.' },
    { re: /\b(14|7|60|90)-day (free )?trial\b/i, msg: 'The free trial is 30 days.' },
    { re: /\bwe sell\b[^.]{0,30}\b(devices|tablets|hardware)\b/i, msg: 'Virtual Front Desk does not sell devices.' },
    { re: /\b(provides?|supplies|includes?) (the |a |our )?receptionists?\b/i, skip: /\?\s*$|\b(not|doesn't|don't|no)\b/i, msg: 'Virtual Front Desk does not supply receptionists. Check the wording.' }
  ];
  var KNOWN_PRICES = ['22', '29', '37', '49', '82', '109', '0.07', '7', '9.99', '0.10', '0.1', '500', '1000', '1,000', '327'];

  var PLAN_GATES = [
    { re: /\bbadges?\b[^.]{0,40}\bprint|\bprint(s|ed|ing)?\b[^.]{0,40}\bbadges?\b/i, feature: 'badge printing', plan: 'Enterprise' },
    { re: /\blive monitoring\b|\blive stream(ing)?\b/i, feature: 'live monitoring', plan: 'Enterprise' },
    { re: /\bdigital scanner\b|\bscan documents\b/i, feature: 'digital scanner', plan: 'Enterprise' },
    { re: /\bStripe\b|\bcard payments?\b|\btake payments?\b/i, feature: 'payments', plan: 'Enterprise' },
    { re: /\bvideo calls?\b/i, feature: 'video calls', plan: 'Professional' },
    { re: /\bAI Agent\b|\bAI receptionist\b/i, feature: 'the AI Agent add-on', plan: 'add-on' }
  ];

  var TERMS = [
    { re: /\bVFD\b/, msg: 'Write "Virtual Front Desk" in full. "VFD" is internal shorthand.' },
    { re: /\bVirtual\s?Frontdesk\b|\bVirtualFrontDesk\b|\bVirtual Front-Desk\b/i, msg: 'Brand name is spelled "Virtual Front Desk".' },
    { re: /\bMS Teams\b/, msg: 'Use "Microsoft Teams" (or "Teams" after first mention), not "MS Teams".' },
    { re: /\bAzure Active Directory\b|\bAzure AD\b/, msg: 'Microsoft renamed it Microsoft Entra ID.' },
    { re: /\bExpress Sign-In\b|\bexpress sign-in\b|\bExpress Sign In\b/, msg: 'The feature is written "Express sign-in".' },
    { re: /\bNeat frame\b|\bneat Frame\b/, msg: 'The device is written "Neat Frame".' },
    { re: /\bTeams Phone standard\b|\bteams phone\b/, msg: 'Write "Teams Phone Standard".' },
    { re: /\bQR-code\b(?!\s)/, msg: 'Write "QR code" without a hyphen in running text.' }
  ];

  var STOP = ['a', 'an', 'the', 'for', 'and', 'or', 'of', 'to', 'in', 'on', 'at', 'is', 'how', 'what', 'with', 'your', 'you', 'it', 'its', 'by'];

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function words(text) {
    var m = String(text || '').match(/[A-Za-z0-9][A-Za-z0-9'’\-.$%]*/g);
    return m ? m.filter(function (w) { return /[A-Za-z0-9]/.test(w); }) : [];
  }
  function wc(text) { return words(text).length; }
  function norm(s) { return String(s || '').replace(/[’‘]/g, "'").replace(/[“”]/g, '"'); }
  function lower(s) { return norm(s).toLowerCase(); }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function countMatches(text, re) { var m = norm(text).match(re); return m ? m.length : 0; }
  function round(n, d) { var p = Math.pow(10, d || 0); return Math.round(n * p) / p; }
  function trimTo(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  function sentences(text) {
    var t = norm(text).replace(/\s+/g, ' ').trim();
    if (!t) return [];
    // Protect common abbreviations from splitting.
    t = t.replace(/\b(e\.g|i\.e|etc|vs|Mr|Ms|Dr|No|St)\./g, '$1∯');
    var parts = t.split(/(?<=[.!?])["')\]]?\s+(?=["'(\[]?[A-Z0-9$])/);
    return parts.map(function (s) { return s.replace(/∯/g, '.').trim(); }).filter(function (s) { return wc(s) > 0; });
  }

  function syllables(word) {
    var w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return 0;
    if (w.length <= 3) return 1;
    w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
    var m = w.match(/[aeiouy]{1,2}/g);
    return Math.max(1, m ? m.length : 1);
  }

  function keywordTokens(k) {
    return lower(k).split(/[^a-z0-9]+/).filter(function (t) { return t && STOP.indexOf(t) === -1; });
  }
  function hasPhrase(text, phrase) {
    if (!phrase) return false;
    return lower(text).indexOf(lower(phrase)) !== -1;
  }
  function hasAllTokens(text, phrase) {
    var toks = keywordTokens(phrase); var t = lower(text);
    if (!toks.length) return false;
    return toks.every(function (k) { return new RegExp('\\b' + esc(k).replace(/s$/, '') + 's?\\b').test(t); });
  }
  function keywordMatch(text, phrase) {
    if (hasPhrase(text, phrase)) return 'exact';
    if (hasAllTokens(text, phrase)) return 'partial';
    return 'none';
  }

  function isInternal(href) {
    if (!href) return false;
    return /^\/(?!\/)/.test(href) || /(^|\/\/)([a-z0-9-]+\.)*virtualfrontdesk\.(com|ca|global|asia)/i.test(href);
  }

  // ---------------------------------------------------------------------------
  // Parsing: Markdown
  // ---------------------------------------------------------------------------

  function parseFrontMatter(src) {
    var meta = {};
    var m = src.match(/^\uFEFF?---\s*\n([\s\S]*?)\n---\s*(\n|$)/);
    if (!m) return { meta: meta, rest: src };
    var lines = m[1].split('\n'); var key = null;
    lines.forEach(function (line) {
      var item = line.match(/^\s+-\s+(.*)$/);
      if (item && key) {
        if (!Array.isArray(meta[key])) meta[key] = [];
        meta[key].push(unquote(item[1]));
        return;
      }
      var kv = line.match(/^([A-Za-z0-9_\-]+)\s*:\s*(.*)$/);
      if (kv) { key = kv[1].toLowerCase(); meta[key] = kv[2] === '' ? [] : unquote(kv[2]); }
    });
    return { meta: meta, rest: src.slice(m[0].length) };
  }
  function unquote(s) {
    s = String(s).trim();
    if ((s[0] === '"' && s[s.length - 1] === '"') || (s[0] === "'" && s[s.length - 1] === "'")) s = s.slice(1, -1);
    return s.replace(/\\"/g, '"');
  }

  function inline(md) {
    var links = [];
    var text = String(md).replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, function (_, t, h) { links.push({ text: stripMd(t), href: h }); return t; })
      .replace(/<(https?:\/\/[^>]+)>/g, function (_, h) { links.push({ text: h, href: h, bare: true }); return h; });
    return { text: stripMd(text), links: links };
  }
  function stripMd(s) {
    return String(s).replace(/\*\*([^*]+)\*\*/g, '$1').replace(/__([^_]+)__/g, '$1')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1$2').replace(/`([^`]+)`/g, '$1').replace(/\\([*_`#|])/g, '$1').trim();
  }

  function parseMarkdown(src) {
    src = norm(String(src).replace(/\r\n?/g, '\n'));
    var fm = parseFrontMatter(src);
    var lines = fm.rest.split('\n');
    var blocks = []; var para = [];
    function flush() {
      if (para.length) { var r = inline(para.join(' ')); blocks.push({ type: 'p', text: r.text, links: r.links }); para = []; }
    }
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var h = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
      if (h) { flush(); var r = inline(h[2]); blocks.push({ type: 'h' + h[1].length, text: r.text, links: r.links }); continue; }
      if (/^\s*\|.*\|\s*$/.test(line)) {
        flush(); var rows = [];
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
          if (!/^\s*\|[\s:\-|]+\|\s*$/.test(lines[i])) {
            rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map(function (c) { return inline(c.trim()); }));
          }
          i++;
        }
        i--;
        var tlinks = []; rows.forEach(function (r) { r.forEach(function (c) { tlinks = tlinks.concat(c.links); }); });
        blocks.push({ type: 'table', rows: rows.map(function (r) { return r.map(function (c) { return c.text; }); }), text: rows.map(function (r) { return r.map(function (c) { return c.text; }).join(' | '); }).join('\n'), links: tlinks });
        continue;
      }
      var li = line.match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);
      if (li) {
        flush(); var r2 = inline(li[2]);
        // Continuation lines of the same list item.
        while (i + 1 < lines.length && /^\s{2,}\S/.test(lines[i + 1]) && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i + 1])) {
          i++; var c = inline(lines[i].trim()); r2.text += ' ' + c.text; r2.links = r2.links.concat(c.links);
        }
        blocks.push({ type: 'li', ordered: /\d/.test(li[1]), text: r2.text, links: r2.links });
        continue;
      }
      var bq = line.match(/^\s*>\s?(.*)$/);
      if (bq) { flush(); var r3 = inline(bq[1]); blocks.push({ type: 'blockquote', text: r3.text, links: r3.links }); continue; }
      if (/^\s*$/.test(line) || /^\s*(-{3,}|\*{3,})\s*$/.test(line)) { flush(); continue; }
      para.push(line.trim());
    }
    flush();
    return finalize({ meta: normalizeMeta(fm.meta), blocks: blocks, source: 'markdown' });
  }

  // ---------------------------------------------------------------------------
  // Parsing: HTML (from mammoth for .docx, or an .html upload). Browser only.
  // ---------------------------------------------------------------------------

  function parseHtml(html, DOMParserImpl) {
    var P = DOMParserImpl || (typeof DOMParser !== 'undefined' ? DOMParser : null);
    if (!P) throw new Error('HTML parsing needs a DOMParser (run in a browser).');
    var doc = new P().parseFromString(String(html), 'text/html');
    var blocks = [];
    function linksOf(el) {
      return Array.prototype.map.call(el.querySelectorAll('a[href]'), function (a) {
        return { text: norm(a.textContent).trim(), href: a.getAttribute('href') };
      }).filter(function (l) { return l.href && l.href.charAt(0) !== '#'; });
    }
    function text(el) { return norm(el.textContent).replace(/\s+/g, ' ').trim(); }
    function walk(el) {
      Array.prototype.forEach.call(el.children, function (c) {
        var tag = c.tagName.toLowerCase();
        if (/^h[1-6]$/.test(tag)) { if (text(c)) blocks.push({ type: tag, text: text(c), links: linksOf(c) }); }
        else if (tag === 'p') { if (text(c)) blocks.push({ type: 'p', text: text(c), links: linksOf(c) }); }
        else if (tag === 'ul' || tag === 'ol') {
          Array.prototype.forEach.call(c.children, function (li) {
            if (li.tagName.toLowerCase() !== 'li') return;
            var clone = li.cloneNode(true);
            Array.prototype.forEach.call(clone.querySelectorAll('ul,ol'), function (n) { n.remove(); });
            if (text(clone)) blocks.push({ type: 'li', ordered: tag === 'ol', text: text(clone), links: linksOf(clone) });
            Array.prototype.forEach.call(li.children, function (n) { if (/^(ul|ol)$/i.test(n.tagName)) walk({ children: [n] }); });
          });
        }
        else if (tag === 'table') {
          var rows = Array.prototype.map.call(c.querySelectorAll('tr'), function (tr) {
            return Array.prototype.map.call(tr.querySelectorAll('th,td'), function (td) { return text(td); });
          }).filter(function (r) { return r.some(function (x) { return x; }); });
          blocks.push({ type: 'table', rows: rows, text: rows.map(function (r) { return r.join(' | '); }).join('\n'), links: linksOf(c) });
        }
        else if (tag === 'blockquote') { if (text(c)) blocks.push({ type: 'blockquote', text: text(c), links: linksOf(c) }); }
        else if (c.children && c.children.length) walk(c);
        else if (text(c)) blocks.push({ type: 'p', text: text(c), links: linksOf(c) });
      });
    }
    walk(doc.body);
    var meta = {};
    var title = doc.querySelector('title');
    var metaDesc = doc.querySelector('meta[name="description"]');
    if (title && text(title)) meta.seo_title = text(title);
    if (metaDesc) meta.meta_description = metaDesc.getAttribute('content');
    return finalize({ meta: normalizeMeta(meta), blocks: blocks, source: 'html' });
  }

  // ---------------------------------------------------------------------------
  // Metadata handling
  // ---------------------------------------------------------------------------

  var META_LABELS = [
    [/^seo title|^title tag|^meta title/, 'seo_title'],
    [/^meta description|^description/, 'meta_description'],
    [/slug|^url/, 'slug'],
    [/primary (target )?question|target question/, 'primary_question'],
    [/primary keyword|focus keyword|target keyword|^keyword/, 'primary_keyword'],
    [/related (queries|keywords)|secondary keywords/, 'related_queries'],
    [/^author title|^author role/, 'author_title'],
    [/^author/, 'author'],
    [/^publisher/, 'publisher'],
    [/date published|published/, 'date_published'],
    [/last updated|date modified|modified|updated/, 'date_modified'],
    [/ai answer summary|answer summary|ai summary|tl;?dr/, 'ai_answer_summary'],
    [/internal links/, 'internal_links'],
    [/article schema/, 'article_schema'],
    [/faq schema/, 'faq_schema']
  ];

  function normalizeMeta(m) {
    var out = {};
    Object.keys(m || {}).forEach(function (k) {
      var key = k.toLowerCase().replace(/[\s-]+/g, '_');
      out[key] = m[k];
    });
    if (typeof out.related_queries === 'string') out.related_queries = out.related_queries.split(/\s*[;\n]\s*|\s*,\s*/).filter(Boolean);
    if (out.author && !out.author_title && /,/.test(out.author)) {
      var parts = String(out.author).split(/,\s*/); out.author = parts.shift(); out.author_title = parts.join(', ');
    }
    return out;
  }

  function metaFromTable(rows) {
    var meta = {}; var hits = 0;
    rows.forEach(function (r) {
      if (r.length < 2) return;
      var label = lower(r[0]).replace(/[:*]/g, '').trim();
      for (var i = 0; i < META_LABELS.length; i++) {
        if (META_LABELS[i][0].test(label)) { meta[META_LABELS[i][1]] = r.slice(1).join(' ').trim(); hits++; break; }
      }
    });
    return hits >= 2 ? meta : null;
  }

  // Split the parsed blocks into: article body, metadata, and anything after
  // (interview sections and other leftovers that must not be published).
  function finalize(doc) {
    var blocks = doc.blocks.filter(function (b) { return !(/^h[12]$/.test(b.type) && /^part\s*\d+\s*:?\s*article\s*$/i.test(b.text)); });
    var body = []; var trailing = []; var meta = doc.meta || {}; var inTail = false; var tailReason = null;
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (/^h[1-3]$/.test(b.type) && /(publishing|article|seo|post)\s+metadata|^metadata$|^part\s*\d+\s*:?\s*(article )?metadata|^part\s*\d+\s*:?\s*interview|^interview( transcript)?$|^transcript$|^seo (details|fields)$/i.test(b.text)) {
        inTail = true;
        if (!tailReason || /interview|transcript/i.test(b.text)) tailReason = /interview|transcript/i.test(b.text) ? b.text : (tailReason || b.text);
      }
      if (b.type === 'table') {
        var tm = metaFromTable(b.rows || []);
        if (tm) { Object.keys(tm).forEach(function (k) { if (!meta[k]) meta[k] = tm[k]; }); inTail = true; continue; }
      }
      (inTail ? trailing : body).push(b);
    }
    var nm = normalizeMeta(meta);
    return { meta: nm, blocks: body, trailing: trailing, tailReason: tailReason, source: doc.source };
  }

  // ---------------------------------------------------------------------------
  // Document model helpers
  // ---------------------------------------------------------------------------

  function model(doc) {
    var b = doc.blocks;
    var h1s = b.filter(function (x) { return x.type === 'h1'; });
    var h1Index = b.findIndex(function (x) { return x.type === 'h1'; });
    var content = h1Index >= 0 ? b.slice(h1Index + 1) : b.slice();
    var prose = content.filter(function (x) { return x.type === 'p' || x.type === 'li' || x.type === 'blockquote'; });
    var textBlocks = content.filter(function (x) { return x.type !== 'table'; });
    var allText = content.map(function (x) { return x.text; }).join('\n');
    var proseText = prose.map(function (x) { return x.text; }).join('\n');

    // Sections by H2.
    var sections = []; var cur = { heading: null, blocks: [] };
    content.forEach(function (x) {
      if (x.type === 'h2') { sections.push(cur); cur = { heading: x.text, blocks: [] }; }
      else cur.blocks.push(x);
    });
    sections.push(cur);
    var intro = sections[0].blocks.filter(function (x) { return x.type === 'p'; });
    sections = sections.slice(1);

    var faq = null;
    sections.forEach(function (s) {
      if (/frequently asked|^faqs?\b|common questions/i.test(s.heading)) {
        var qs = []; var q = null;
        s.blocks.forEach(function (x) {
          if (x.type === 'h3' || x.type === 'h4') { q = { q: x.text, a: [] }; qs.push(q); }
          else if (q && x.type !== 'table') q.a.push(x.text);
        });
        faq = { section: s, items: qs.map(function (it) { return { q: it.q, a: it.a.join(' ') }; }) };
      }
    });

    var sents = [];
    prose.forEach(function (x) { sentences(x.text).forEach(function (s) { sents.push(s); }); });
    var links = [];
    content.forEach(function (x) { (x.links || []).forEach(function (l) { links.push(l); }); });

    return {
      h1s: h1s, h1: h1s[0] ? h1s[0].text : '', content: content, prose: prose, textBlocks: textBlocks,
      allText: allText, proseText: proseText, sections: sections, intro: intro, faq: faq,
      sentences: sents, links: links, words: wc(allText)
    };
  }

  // ---------------------------------------------------------------------------
  // Checks
  // ---------------------------------------------------------------------------

  function runChecks(doc) {
    var m = model(doc);
    var meta = doc.meta || {};
    var kw = meta.primary_keyword || '';
    var checks = [];
    function add(cat, id, label, status, detail, opts) {
      opts = opts || {};
      checks.push({ category: cat, id: id, label: label, status: status, detail: detail || '', fix: opts.fix || '', items: opts.items || [], weight: opts.weight || 1 });
    }

    // ---- Interview residue (publish blockers) -------------------------------
    var C0 = 'Interview residue';
    var quoteHits = [];
    m.prose.forEach(function (x) {
      var re = /"([^"]+)"/g; var mm;
      while ((mm = re.exec(x.text))) { if (wc(mm[1]) >= 10) quoteHits.push(trimTo(mm[0], 140)); }
    });
    add(C0, 'no_long_quotes', 'No quoted interview answers', quoteHits.length ? 'fail' : 'pass',
      quoteHits.length ? quoteHits.length + ' long quotation(s) found. The article must not quote the interview.' : 'No quotations of 10+ words.',
      { items: quoteHits, weight: 3, fix: 'Paraphrase the idea in the article\'s own voice and remove the quotation marks.' });

    var attrib = [];
    m.sentences.forEach(function (s) {
      if (/\b(Jeff|Letendre|our CEO|the CEO|our founder|the founder|interviewer|interviewee)\b/i.test(s)) attrib.push(s);
      else if (/\b(says|said|explains|explained|added|recalls|told us|puts it)\b/i.test(s) && /"/.test(s)) attrib.push(s);
      else if (/\b(?!(?:Desk|Teams|Microsoft|Agent|Frame|Station)\b)[A-Z][a-z]+(,[^,]{3,60},)?\s(says|said|explains|explained|recalls|told us)\b/.test(s)) attrib.push(s);
    });
    m.content.filter(function (x) { return /^h/.test(x.type); }).forEach(function (h) { if (/\b(Jeff|Letendre|interview)\b/i.test(h.text)) attrib.push(h.text); });
    add(C0, 'no_attribution', 'No names or attributions in the body', attrib.length ? 'fail' : 'pass',
      attrib.length ? 'The body names or attributes a person.' : 'No people named or quoted in the body. Author credit lives in the metadata.',
      { items: attrib.map(function (s) { return trimTo(s, 160); }), weight: 3, fix: 'Remove the name and the "says" construction. State the insight as the article\'s own point of view.' });

    var qa = m.content.filter(function (x) { return /^\s*(\*\*)?(Q|A|Question|Answer)\s*[:.]/i.test(x.text) || /^[A-Z][a-z]+\s*:\s/.test(x.text) && x.type === 'p' && /^(Jeff|Joseph|Interviewer|Host|Guest)\s*:/i.test(x.text); });
    var tailInterview = (doc.trailing || []).some(function (x) { return /interview|^\s*(\*\*)?Q\s*:/i.test(x.text); });
    add(C0, 'no_qa', 'No Q&A or interview sections', (qa.length || tailInterview) ? 'fail' : 'pass',
      tailInterview ? 'The file still contains an interview section ("' + (doc.tailReason || 'Interview') + '"). Remove it before publishing.' : qa.length ? 'Q&A formatting found in the body.' : 'No Q&A formatting.',
      { items: qa.map(function (x) { return trimTo(x.text, 140); }), weight: 3, fix: 'Delete the interview transcript and any "Q:" / "A:" lines. Rewrite answers as sections.' });

    var notes = [];
    var noteRe = /\b(TODO|TBD|TK|lorem ipsum|placeholder|\[insert|\[link|xx+\b|can quote from this section|note to (editor|self))/i;
    m.content.forEach(function (x) { if (noteRe.test(x.text)) notes.push(trimTo(x.text, 140)); });
    add(C0, 'no_notes', 'No editor notes or placeholders', notes.length ? 'fail' : 'pass',
      notes.length ? 'Placeholder or internal note found.' : 'No placeholders.', { items: notes, weight: 3, fix: 'Replace placeholders with final copy and delete internal notes.' });

    // ---- Structure -----------------------------------------------------------
    var C1 = 'Structure';
    add(C1, 'single_h1', 'Exactly one H1 title', m.h1s.length === 1 ? 'pass' : 'fail',
      m.h1s.length === 1 ? '"' + m.h1 + '"' : m.h1s.length + ' H1 headings found.',
      { weight: 3, fix: 'Use one H1 for the title. Every section heading is an H2.' });
    var h1len = m.h1.length;
    add(C1, 'h1_length', 'Title length ' + LIMITS.h1[0] + '–' + LIMITS.h1[1] + ' characters', !m.h1 ? 'fail' : (h1len >= LIMITS.h1[0] && h1len <= LIMITS.h1[1]) ? 'pass' : 'warn',
      h1len + ' characters.', { fix: 'Tighten the title to the question the reader is asking.' });

    var wsStatus = (m.words < LIMITS.wordsHard[0] || m.words > LIMITS.wordsHard[1]) ? 'fail' : (m.words < LIMITS.words[0] || m.words > LIMITS.words[1]) ? 'warn' : 'pass';
    add(C1, 'word_count', 'Length ' + LIMITS.words[0] + '–' + LIMITS.words[1] + ' words', wsStatus, m.words + ' words in the article body.',
      { weight: 2, fix: m.words < LIMITS.words[0] ? 'Add depth: a worked example, a comparison table or a setup section.' : 'Cut repetition; split into two articles if it covers two questions.' });

    var h2s = m.sections.map(function (s) { return s.heading; });
    add(C1, 'h2_count', LIMITS.h2[0] + '–' + LIMITS.h2[1] + ' H2 sections', (h2s.length >= LIMITS.h2[0] && h2s.length <= LIMITS.h2[1]) ? 'pass' : h2s.length < 3 ? 'fail' : 'warn',
      h2s.length + ' H2 sections.', { fix: 'Break the article into sections that each answer one sub-question.' });

    var hierarchy = []; var lastLevel = 1;
    m.content.forEach(function (x) {
      var mm = x.type.match(/^h([1-6])$/); if (!mm) return;
      var lvl = +mm[1];
      if (lvl > lastLevel + 1) hierarchy.push('H' + lvl + ' after H' + lastLevel + ': "' + trimTo(x.text, 70) + '"');
      lastLevel = lvl;
    });
    add(C1, 'hierarchy', 'Heading levels don\'t skip', hierarchy.length ? 'warn' : 'pass', hierarchy.length ? 'Skipped heading levels.' : 'Headings nest correctly.',
      { items: hierarchy, fix: 'Use H2 for sections and H3 only inside a section.' });

    var qHeads = h2s.filter(function (h) { return /\?\s*$/.test(h) || /^(how|what|why|when|which|who|can|do|does|is|are|should)\b/i.test(h); });
    add(C1, 'question_headings', 'At least 2 H2s phrased as questions', qHeads.length >= 2 ? 'pass' : 'warn',
      qHeads.length + ' question-style H2(s). AI search matches headings to the questions people ask.',
      { items: qHeads, fix: 'Rephrase two section headings as the question a reader would type, e.g. "How does QR code sign-in work?"' });

    var badSections = [];
    m.sections.forEach(function (s) {
      if (/frequently asked|faq/i.test(s.heading)) return;
      var n = wc(s.blocks.map(function (x) { return x.text; }).join(' '));
      if (n < LIMITS.section[0]) badSections.push('"' + trimTo(s.heading, 60) + '": ' + n + ' words (too thin)');
      else if (n > LIMITS.section[1]) badSections.push('"' + trimTo(s.heading, 60) + '": ' + n + ' words (too long)');
    });
    add(C1, 'section_length', 'Each section ' + LIMITS.section[0] + '–' + LIMITS.section[1] + ' words', badSections.length ? 'warn' : 'pass',
      badSections.length ? badSections.length + ' section(s) out of range.' : 'Every section is a self-contained, retrievable chunk.',
      { items: badSections, fix: 'Merge thin sections into a neighbour; split long ones with a new H2.' });

    var longP = m.content.filter(function (x) { return x.type === 'p' && wc(x.text) > LIMITS.paragraphWarn; });
    var veryLong = longP.filter(function (x) { return wc(x.text) > LIMITS.paragraphFail; });
    add(C1, 'paragraph_length', 'Paragraphs under ' + LIMITS.paragraphWarn + ' words', veryLong.length ? 'fail' : longP.length ? 'warn' : 'pass',
      longP.length ? longP.length + ' long paragraph(s).' : 'All paragraphs are short and scannable.',
      { items: longP.map(function (x) { return wc(x.text) + ' words: ' + trimTo(x.text, 100); }), fix: 'One idea per paragraph. Split at the second idea.' });

    var lis = m.content.filter(function (x) { return x.type === 'li'; });
    var ordered = lis.filter(function (x) { return x.ordered; });
    add(C1, 'lists', 'Uses lists, including a numbered process', !lis.length ? 'fail' : ordered.length ? 'pass' : 'warn',
      lis.length + ' list items (' + ordered.length + ' numbered).', { fix: 'Turn any step-by-step explanation into a numbered list.' });
    var tables = m.content.filter(function (x) { return x.type === 'table'; });
    add(C1, 'table', 'Has a comparison or summary table', tables.length ? 'pass' : 'warn',
      tables.length + ' table(s). Tables are often lifted directly into AI answers.', { fix: 'Add a table comparing options, plans, licenses or steps.' });

    // ---- AI visibility -------------------------------------------------------
    var C2 = 'AI visibility (GEO)';
    var introText = m.intro.map(function (x) { return x.text; }).join(' ');
    var firstPara = m.intro[0] ? m.intro[0].text : '';
    var introWc = wc(firstPara);
    add(C2, 'intro_length', 'Answer-first intro of ' + LIMITS.intro[0] + '–' + LIMITS.intro[1] + ' words', !firstPara ? 'fail' : (introWc >= LIMITS.intro[0] && introWc <= LIMITS.intro[1]) ? 'pass' : 'warn',
      firstPara ? 'Opening paragraph: ' + introWc + ' words.' : 'No paragraph before the first H2.',
      { weight: 2, fix: 'Open with one paragraph that fully answers the target question, so it can be quoted on its own.' });
    var firstSentence = sentences(firstPara)[0] || '';
    add(C2, 'intro_direct', 'First sentence answers, no warm-up', !firstSentence ? 'fail' : THROAT_CLEARING.test(firstSentence) ? 'fail' : wc(firstSentence) > 40 ? 'warn' : 'pass',
      firstSentence ? '"' + trimTo(firstSentence, 160) + '"' : 'Missing.',
      { weight: 2, fix: 'Start with the answer: "[Topic] is/lets/means…". Cut any scene-setting opener.' });
    add(C2, 'intro_brand', 'Intro names Virtual Front Desk', hasPhrase(firstPara, BRAND) ? 'pass' : hasPhrase(introText, BRAND) ? 'warn' : 'fail',
      hasPhrase(firstPara, BRAND) ? 'Brand appears in the opening paragraph.' : 'Brand missing from the opening paragraph.',
      { weight: 2, fix: 'Name Virtual Front Desk in the first paragraph so AI answers attribute the solution to the brand.' });
    if (kw) {
      var ik = keywordMatch(firstPara, kw);
      add(C2, 'intro_keyword', 'Intro contains the primary keyword', ik === 'exact' ? 'pass' : ik === 'partial' ? 'warn' : 'fail',
        'Keyword "' + kw + '": ' + (ik === 'exact' ? 'exact match' : ik === 'partial' ? 'all words present, not as a phrase' : 'not found') + '.',
        { weight: 2, fix: 'Use the exact keyword phrase once in the first two sentences.' });
    }

    var faqItems = m.faq ? m.faq.items : [];
    var faqStatus = !m.faq ? 'fail' : (faqItems.length >= LIMITS.faq[0] && faqItems.length <= LIMITS.faq[1]) ? 'pass' : 'warn';
    add(C2, 'faq', 'FAQ section with ' + LIMITS.faq[0] + '–' + LIMITS.faq[1] + ' questions', faqStatus,
      m.faq ? faqItems.length + ' FAQ question(s) as H3s.' : 'No "Frequently asked questions" H2 with H3 questions.',
      { weight: 2, items: faqItems.map(function (f) { return f.q; }), fix: 'Add an H2 "Frequently asked questions" with 4–6 H3 questions taken from real searches and the interview.' });
    if (m.faq) {
      var faqIssues = [];
      faqItems.forEach(function (f) {
        var n = wc(f.a); var first = sentences(f.a)[0] || '';
        if (!/\?\s*$/.test(f.q)) faqIssues.push('Question doesn\'t end with "?": ' + f.q);
        if (n < LIMITS.faqAnswer[0] || n > LIMITS.faqAnswer[1]) faqIssues.push(n + '-word answer: ' + f.q);
        if (wc(first) > 30) faqIssues.push('First sentence is long, answer directly: ' + f.q);
        if (!hasPhrase(f.q + ' ' + f.a, BRAND) && /^(do|does|can|is|are|which|how much)\b/i.test(f.q) && !/\b(it|this)\b/i.test(f.q)) { /* ok */ }
      });
      add(C2, 'faq_answers', 'FAQ answers are direct and ' + LIMITS.faqAnswer[0] + '–' + LIMITS.faqAnswer[1] + ' words', faqIssues.length ? 'warn' : 'pass',
        faqIssues.length ? faqIssues.length + ' FAQ issue(s).' : 'Every answer leads with the answer and stands alone.',
        { items: faqIssues, fix: 'Lead with "Yes", "No" or the fact, then one or two supporting sentences.' });
    }

    var sum = meta.ai_answer_summary || '';
    var sumWc = wc(sum);
    add(C2, 'ai_summary', 'AI answer summary (' + LIMITS.summary[0] + '–' + LIMITS.summary[1] + ' words, names the brand)',
      !sum ? 'fail' : (sumWc >= LIMITS.summary[0] && sumWc <= LIMITS.summary[1] && hasPhrase(sum, BRAND)) ? 'pass' : 'warn',
      sum ? sumWc + ' words' + (hasPhrase(sum, BRAND) ? '.' : ', brand missing.') : 'No AI answer summary in the metadata.',
      { weight: 2, fix: 'Write a 40–90 word factual summary that names Virtual Front Desk. Use it for the excerpt and the schema description.' });

    var brandCount = countMatches(m.allText, /Virtual Front Desk/g);
    add(C2, 'brand_mentions', 'Brand named at least ' + LIMITS.brandMentions + ' times', brandCount >= LIMITS.brandMentions ? 'pass' : 'warn',
      brandCount + ' mention(s) of "Virtual Front Desk". Consistent entity naming helps LLMs connect the answer to the brand.',
      { fix: 'Use the full brand name where a generic "the platform" or "it" appears.' });

    var factCount = countMatches(m.allText, /\$\d[\d,.]*|\b\d+(\.\d+)?[\s-]?(%|seconds?|minutes?|months?|weeks?|days?|hours?|digit|words?|pages?|feeds?|users?|stations?|lobbies|locations?|languages?|steps?|fields?|plans?|times?|countries)\b|\b(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}\b|\b(TLS 1\.\d|AES-256|SOC 2|ISO\/IEC \d+|GDPR|Type I)\b/gi);
    add(C2, 'fact_density', 'Specific facts and numbers (' + LIMITS.facts + '+)', factCount >= LIMITS.facts ? 'pass' : 'warn',
      factCount + ' specific facts (prices, durations, limits, standards). LLMs prefer citable specifics.',
      { fix: 'Replace vague claims with the setting, number or limit: "30 seconds by default", "$49 per station".' });

    var dangling = [];
    m.sections.forEach(function (s) {
      var first = s.blocks.filter(function (x) { return x.type === 'p'; })[0];
      if (first && /^(this|that|these|those|it|they)\b/i.test(first.text) && !/^(it's|that's)\b/i.test(first.text)) dangling.push('"' + trimTo(s.heading, 50) + '": ' + trimTo(first.text, 80));
    });
    add(C2, 'self_contained', 'Sections open without dangling references', dangling.length ? 'warn' : 'pass',
      dangling.length ? 'Section openers that depend on the previous section.' : 'Each section makes sense when retrieved on its own.',
      { items: dangling, fix: 'Name the subject in the first sentence of each section instead of "This" or "It".' });

    // ---- SEO -----------------------------------------------------------------
    var C3 = 'SEO';
    var st = meta.seo_title || '';
    add(C3, 'seo_title', 'SEO title ' + LIMITS.seoTitle[0] + '–' + LIMITS.seoTitle[1] + ' characters', !st ? 'fail' : (st.length >= LIMITS.seoTitle[0] && st.length <= LIMITS.seoTitle[1]) ? 'pass' : 'warn',
      st ? st.length + ' characters: "' + st + '"' : 'No SEO title in the metadata.', { weight: 2, fix: 'Keep it under 60 characters so it isn\'t cut off in results.' });
    var md = meta.meta_description || '';
    add(C3, 'meta_description', 'Meta description ' + LIMITS.meta[0] + '–' + LIMITS.meta[1] + ' characters', !md ? 'fail' : (md.length >= LIMITS.meta[0] && md.length <= LIMITS.meta[1]) ? 'pass' : 'warn',
      md ? md.length + ' characters.' : 'No meta description.', { weight: 2, fix: 'Write 120–160 characters: what the reader learns, with the keyword near the start.' });
    var slug = String(meta.slug || '').trim();
    var slugOk = /^\/?(blog\/)?[a-z0-9]+(-[a-z0-9]+)*\/?$/.test(slug.replace(/^https?:\/\/[^/]+/, '')) && slug.length <= LIMITS.slugMax;
    add(C3, 'slug', 'Clean URL slug', !slug ? 'fail' : slugOk ? 'pass' : 'warn', slug ? slug : 'No slug.',
      { fix: 'Lowercase words joined by hyphens, under 75 characters, e.g. /blog/qr-code-visitor-sign-in.' });
    add(C3, 'primary_keyword', 'Primary keyword defined', kw ? 'pass' : 'fail', kw ? '"' + kw + '"' : 'No primary keyword in the metadata.',
      { weight: 2, fix: 'Add the one search phrase this article should rank and be cited for.' });
    if (kw) {
      var places = [
        ['H1 title', keywordMatch(m.h1, kw)], ['SEO title', keywordMatch(st, kw)], ['Meta description', keywordMatch(md, kw)],
        ['URL slug', keywordMatch(slug.replace(/[-/]/g, ' '), kw)], ['An H2 heading', h2s.some(function (h) { return keywordMatch(h, kw) !== 'none'; }) ? 'partial' : 'none']
      ];
      var missing = places.filter(function (p) { return p[1] === 'none'; }).map(function (p) { return p[0]; });
      var critical = missing.filter(function (p) { return p === 'H1 title' || p === 'SEO title'; });
      add(C3, 'keyword_placement', 'Keyword in title, SEO title, meta, slug and an H2', critical.length ? 'fail' : missing.length ? 'warn' : 'pass',
        missing.length ? 'Missing from: ' + missing.join(', ') + '.' : 'Keyword appears in every key position.',
        { weight: 2, fix: 'Place the keyword (or all its main words) in each position listed.' });
      var occ = countMatches(m.allText, new RegExp(esc(kw), 'gi'));
      var density = m.words ? occ * wc(kw) / m.words * 100 : 0;
      add(C3, 'keyword_density', 'Keyword density ' + LIMITS.density[0] + '–' + LIMITS.density[1] + '%', occ === 0 ? 'fail' : (density >= LIMITS.density[0] && density <= LIMITS.density[1]) ? 'pass' : 'warn',
        occ + ' exact use(s), ' + round(density, 2) + '% density.', { fix: density > LIMITS.density[1] ? 'Too repetitive. Use synonyms and related queries.' : 'Use the exact phrase in a heading and once more in the body.' });
    }
    var internal = m.links.filter(function (l) { return isInternal(l.href); });
    var help = internal.filter(function (l) { return /help\.virtualfrontdesk/i.test(l.href); });
    add(C3, 'internal_links', LIMITS.internalLinks + '+ internal links', internal.length >= LIMITS.internalLinks ? 'pass' : internal.length ? 'warn' : 'fail',
      internal.length + ' internal link(s), ' + help.length + ' to the help center, ' + (m.links.length - internal.length) + ' external.',
      { weight: 2, items: internal.map(function (l) { return l.text + ' → ' + l.href; }), fix: 'Link to related blog posts, the pricing page and the matching help center article.' });
    var weak = m.links.filter(function (l) { return WEAK_ANCHORS.test(String(l.text).trim()) || /^https?:\/\//.test(String(l.text).trim()); });
    add(C3, 'anchor_text', 'Descriptive link text', weak.length ? 'warn' : m.links.length ? 'pass' : 'warn',
      weak.length ? weak.length + ' weak anchor(s).' : m.links.length ? 'All anchors describe the destination.' : 'No links found.',
      { items: weak.map(function (l) { return '"' + l.text + '" → ' + l.href; }), fix: 'Use anchors that say where the link goes: "set up the Microsoft Teams integration".' });
    var rq = Array.isArray(meta.related_queries) ? meta.related_queries : [];
    add(C3, 'related_queries', LIMITS.relatedQueries + '+ related queries', rq.length >= LIMITS.relatedQueries ? 'pass' : 'warn',
      rq.length + ' related queries listed.', { items: rq, fix: 'List the long-tail questions this article also answers. Cover each one somewhere in the body.' });
    add(C3, 'primary_question', 'Target question recorded', meta.primary_question ? 'pass' : 'warn', meta.primary_question || 'No target question.',
      { fix: 'Record the AI-visibility question this article is built to answer.' });
    var eeat = [];
    if (!meta.author) eeat.push('author'); if (!meta.publisher) eeat.push('publisher');
    if (!meta.date_modified && !meta.date_published) eeat.push('date');
    add(C3, 'eeat', 'Author, publisher and date for schema', eeat.length ? 'warn' : 'pass',
      eeat.length ? 'Missing: ' + eeat.join(', ') + '.' : (meta.author + (meta.author_title ? ', ' + meta.author_title : '') + ' · ' + (meta.date_modified || meta.date_published)),
      { fix: 'Add author, author title, publisher and last-updated date. They feed the Article schema.' });

    // ---- Human voice & readability ------------------------------------------
    var C4 = 'Human voice';
    var sl = m.sentences.map(wc);
    var totalSyl = 0; var totalW = 0;
    m.sentences.forEach(function (s) { words(s).forEach(function (w) { totalW++; totalSyl += syllables(w); }); });
    var avg = sl.length ? sl.reduce(function (a, b) { return a + b; }, 0) / sl.length : 0;
    var flesch = sl.length ? 206.835 - 1.015 * avg - 84.6 * (totalSyl / Math.max(1, totalW)) : 0;
    add(C4, 'flesch', 'Readability (Flesch ' + LIMITS.flesch[0] + '+)', flesch >= LIMITS.flesch[0] ? 'pass' : flesch >= LIMITS.flesch[1] ? 'warn' : 'fail',
      'Flesch reading ease ' + round(flesch, 0) + ' (60+ is plain English; 45+ is fine for B2B).', { weight: 2, fix: 'Shorter sentences, shorter words. Replace jargon with what the person does.' });
    add(C4, 'avg_sentence', 'Average sentence ' + LIMITS.avgSentence[0] + '–' + LIMITS.avgSentence[1] + ' words', (avg >= LIMITS.avgSentence[0] && avg <= LIMITS.avgSentence[1]) ? 'pass' : 'warn',
      round(avg, 1) + ' words per sentence across ' + sl.length + ' sentences.', { fix: 'Mix short punchy sentences with longer explanatory ones.' });
    var longS = m.sentences.filter(function (s) { return wc(s) > 30; });
    var longPct = sl.length ? longS.length / sl.length * 100 : 0;
    add(C4, 'long_sentences', 'Few sentences over 30 words', longPct <= LIMITS.longSentencePct[0] ? 'pass' : longPct <= LIMITS.longSentencePct[1] ? 'warn' : 'fail',
      longS.length + ' long sentence(s), ' + round(longPct, 0) + '%.', { items: longS.map(function (s) { return trimTo(s, 160); }), fix: 'Split at "and", "which" or a semicolon.' });
    var mean = avg; var sd = sl.length ? Math.sqrt(sl.reduce(function (a, b) { return a + Math.pow(b - mean, 2); }, 0) / sl.length) : 0;
    add(C4, 'burstiness', 'Varied sentence rhythm', sd >= LIMITS.burstiness ? 'pass' : 'warn',
      'Sentence length varies by ±' + round(sd, 1) + ' words. Uniform rhythm is a common tell of machine-written text.',
      { fix: 'Add a few very short sentences. Let one or two run longer.' });
    var contractions = countMatches(m.proseText, CONTRACTIONS);
    var cPer = m.words ? contractions / m.words * 1000 : 0;
    add(C4, 'contractions', 'Conversational contractions', cPer >= LIMITS.contractionsPer1k ? 'pass' : 'warn',
      contractions + ' contractions (' + round(cPer, 1) + ' per 1,000 words).', { fix: 'Write "it\'s", "you\'ll", "doesn\'t" where you would say them out loud.' });
    var you = countMatches(m.proseText, YOU); var yPer = m.words ? you / m.words * 1000 : 0;
    add(C4, 'reader_focus', 'Talks to the reader ("you")', yPer >= LIMITS.youPer1k ? 'pass' : 'warn',
      you + ' uses of you/your (' + round(yPer, 1) + ' per 1,000 words).', { fix: 'Address the reader directly: "your lobby", "you choose".' });
    var passive = m.sentences.filter(function (s) { return PASSIVE.test(s); });
    var pPct = sl.length ? passive.length / sl.length * 100 : 0;
    add(C4, 'passive', 'Mostly active voice', pPct <= LIMITS.passivePct[0] ? 'pass' : pPct <= LIMITS.passivePct[1] ? 'warn' : 'fail',
      round(pPct, 0) + '% of sentences look passive.', { items: passive.slice(0, 12).map(function (s) { return trimTo(s, 140); }), fix: 'Name who does the action: "the station prints a badge", not "a badge is printed".' });

    var hard = []; var soft = [];
    var lowAll = lower(m.allText);
    BANNED_HARD.forEach(function (w) { var n = countMatches(lowAll, new RegExp('\\b' + esc(w) + '\\b', 'g')); if (n) hard.push(w + (n > 1 ? ' ×' + n : '')); });
    BANNED_SOFT.forEach(function (w) { var n = countMatches(lowAll, new RegExp('\\b' + esc(w) + '\\b', 'g')); if (n) soft.push(w + (n > 1 ? ' ×' + n : '')); });
    add(C4, 'ai_phrases', 'No AI clichés or hype words', hard.length ? 'fail' : soft.length > 2 ? 'warn' : 'pass',
      hard.length ? hard.length + ' banned phrase(s).' : soft.length ? soft.length + ' word(s) to use sparingly.' : 'No clichés found.',
      { weight: 2, items: hard.map(function (w) { return 'Banned: ' + w; }).concat(soft.map(function (w) { return 'Use sparingly: ' + w; })), fix: 'Say what the product does instead of how impressive it is.' });
    var stiff = m.sentences.filter(function (s) { var f = lower(s).replace(/^[^a-z]+/, ''); return STIFF_STARTERS.some(function (w) { return f.indexOf(w + ',') === 0 || f.indexOf(w + ' ') === 0; }); });
    add(C4, 'connectors', 'No stiff transition words', stiff.length > 1 ? 'warn' : 'pass', stiff.length + ' sentence(s) start with Moreover, Furthermore, Additionally…',
      { items: stiff.map(function (s) { return trimTo(s, 120); }), fix: 'Use "And", "But", "So", or just start the sentence.' });
    var em = countMatches(m.allText, /—/g);
    add(C4, 'em_dash', 'No em dashes (house style)', em === 0 ? 'pass' : em <= 3 ? 'warn' : 'fail', em + ' em dash(es).',
      { fix: 'Replace with a comma, a colon, parentheses or a full stop.' });
    var excl = countMatches(m.proseText, /!/g);
    add(C4, 'exclamations', 'No exclamation marks', excl ? 'warn' : 'pass', excl + ' exclamation mark(s).', { fix: 'Let the facts carry the energy.' });
    var starts = {}; m.sentences.forEach(function (s) { var w = lower(words(s)[0] || ''); if (w) starts[w] = (starts[w] || 0) + 1; });
    var repeated = Object.keys(starts).filter(function (k) { return ['the', 'a', 'it', 'you', 'if', 'they', 'each', 'every', 'on', 'in'].indexOf(k) === -1 && starts[k] / Math.max(1, sl.length) > 0.08 && starts[k] >= 5; });
    add(C4, 'openers', 'Varied sentence openers', repeated.length ? 'warn' : 'pass',
      repeated.length ? 'Overused opener(s): ' + repeated.map(function (k) { return '"' + k + '" ×' + starts[k]; }).join(', ') : 'Sentence openers vary.',
      { fix: 'Rewrite a few sentences to start with the subject or the action.' });

    // ---- Brand & facts ------------------------------------------------------
    var C5 = 'Brand & facts';
    var termHits = [];
    TERMS.forEach(function (t) { var mm = m.allText.match(t.re); if (mm) termHits.push('"' + mm[0] + '": ' + t.msg); });
    add(C5, 'terminology', 'Brand and product names spelled correctly', termHits.length ? 'warn' : 'pass',
      termHits.length ? termHits.length + ' naming issue(s).' : 'Virtual Front Desk, Express sign-in, Microsoft Teams, Neat Frame all correct.', { items: termHits });
    var factFails = []; var factWarns = [];
    var factScope = m.allText + '\n' + [meta.seo_title, meta.meta_description, meta.ai_answer_summary, meta.author_title].join('\n');
    FACT_FAILS.forEach(function (f) { var mm = factScope.match(f.re); if (mm) factFails.push('"' + mm[0] + '": ' + f.msg); });
    var factSentences = m.sentences.concat(m.content.filter(function (x) { return /^h|table/.test(x.type); }).map(function (x) { return x.text; }));
    FACT_WARNS.forEach(function (f) {
      for (var i = 0; i < factSentences.length; i++) {
        var mm = factSentences[i].match(f.re);
        if (mm && !(f.skip && f.skip.test(factSentences[i]))) { factWarns.push('"' + trimTo(mm[0], 80) + '": ' + f.msg); break; }
      }
    });
    add(C5, 'facts_known_errors', 'No known factual errors', factFails.length ? 'fail' : 'pass',
      factFails.length ? factFails.length + ' claim(s) contradict verified product facts.' : 'No known-wrong claims (SOC 2 type, HIPAA, author title).',
      { weight: 3, items: factFails, fix: 'Correct against references/product-facts.md.' });
    add(C5, 'facts_unverified', 'No unverified claims', factWarns.length ? 'warn' : 'pass',
      factWarns.length ? factWarns.length + ' claim(s) need confirmation.' : 'No claims from the unverified list.', { items: factWarns });
    var prices = (m.allText + ' ' + (meta.ai_answer_summary || '')).match(/\$\s?\d[\d,]*(\.\d+)?/g) || [];
    var unknown = prices.map(function (p) { return p.replace(/[$\s]/g, ''); }).filter(function (p) { return KNOWN_PRICES.indexOf(p) === -1 && KNOWN_PRICES.indexOf(p.replace(/,/g, '')) === -1; });
    add(C5, 'prices', 'Prices match the pricing page', unknown.length ? 'warn' : 'pass',
      prices.length ? prices.length + ' price(s) mentioned' + (unknown.length ? ', ' + unknown.length + ' not on the pricing page.' : ', all match.') : 'No prices mentioned.',
      { items: unknown.map(function (p) { return '$' + p + ' is not a current Virtual Front Desk price.'; }), fix: 'Check virtualfrontdesk.com/pricing. Monthly: $29 / $49 / $109 per station; AI Agent $9.99 + $0.10/min.' });
    var gates = [];
    PLAN_GATES.forEach(function (g) {
      if (!g.re.test(m.allText)) return;
      var ok = g.plan === 'add-on' ? /\badd-on\b/i.test(m.allText) : g.plan === 'Professional' ? /\b(Professional|Enterprise)\b/.test(m.allText) : new RegExp('\\b' + g.plan + '\\b').test(m.allText);
      if (!ok) gates.push(g.feature + ' is mentioned but the ' + g.plan + (g.plan === 'add-on' ? '' : ' plan') + ' is not.');
    });
    add(C5, 'plan_gating', 'Plan requirements stated for gated features', gates.length ? 'warn' : 'pass',
      gates.length ? gates.length + ' gated feature(s) without the plan named.' : 'Every plan-gated feature names its plan.',
      { items: gates, fix: 'Say which plan a feature needs the first time you mention it.' });
    var sup = m.sentences.filter(function (s) { return /\b(the best|the most (powerful|advanced|complete)|industry[- ]leading|#1|number one|unmatched|unrivaled|the only)\b/i.test(s); });
    add(C5, 'superlatives', 'No unproven superlatives', sup.length ? 'warn' : 'pass', sup.length + ' superlative claim(s).',
      { items: sup.map(function (s) { return trimTo(s, 140); }), fix: 'Replace "the best" with the specific thing it does better.' });

    // ---- Conversion ---------------------------------------------------------
    var C6 = 'Conversion';
    var last = m.sections[m.sections.length - 1];
    var lastText = last ? last.blocks.map(function (x) { return x.text; }).join(' ') : '';
    var lastLinks = last ? [].concat.apply([], last.blocks.map(function (x) { return x.links || []; })) : [];
    var lastIsFaq = last && /frequently asked|faq/i.test(last.heading);
    var ctaLink = lastLinks.some(function (l) { return /free-demo-trial|pricing|register|contact-us|demo/i.test(l.href); });
    var ctaWords = /free trial|start (a|your) trial|book a demo|get started|pricing/i.test(lastText);
    add(C6, 'cta', 'Closing section with a clear call to action', (!lastIsFaq && ctaLink) ? 'pass' : (ctaWords || ctaLink) ? 'warn' : 'fail',
      lastIsFaq ? 'The article ends on the FAQ. Add a short closing section after it.' : ctaLink ? 'Closing section "' + last.heading + '" links to the trial or pricing.' : 'No trial or pricing link in the closing section.',
      { weight: 2, fix: 'End with a short "next step" section and one link to the 30-day free trial or the pricing page.' });
    var trialLinks = m.links.filter(function (l) { return /free-demo-trial|register/i.test(l.href); });
    add(C6, 'cta_restraint', 'Not over-selling (≤3 trial links)', trialLinks.length <= 3 ? 'pass' : 'warn', trialLinks.length + ' trial link(s).',
      { fix: 'Keep one primary CTA at the end. Educational content earns more trust than repeated sign-up prompts.' });

    return score(checks, m, doc, { flesch: flesch, avgSentence: avg, sentences: sl.length, contractions: contractions, brandCount: brandCount });
  }

  function score(checks, m, doc, s) {
    var total = 0; var got = 0; var fails = 0; var warns = 0;
    checks.forEach(function (c) {
      total += c.weight;
      if (c.status === 'pass') got += c.weight;
      else if (c.status === 'warn') { got += c.weight * 0.5; warns++; }
      else fails++;
    });
    var pct = total ? Math.round(got / total * 100) : 0;
    var verdict = fails ? 'Not ready' : (pct >= 95 && warns <= 2) ? 'Ready to publish' : 'Almost ready';
    var cats = [];
    checks.forEach(function (c) {
      var cat = cats.filter(function (x) { return x.name === c.category; })[0];
      if (!cat) { cat = { name: c.category, checks: [] }; cats.push(cat); }
      cat.checks.push(c);
    });
    return {
      score: pct, verdict: verdict, fails: fails, warnings: warns, passes: checks.length - fails - warns,
      categories: cats, checks: checks,
      stats: {
        title: m.h1, words: m.words, sections: m.sections.length, faq: m.faq ? m.faq.items.length : 0,
        sentences: s.sentences, avgSentence: round(s.avgSentence, 1), flesch: round(s.flesch, 0),
        links: m.links.length, readingMinutes: Math.max(1, Math.round(m.words / 230)), brandMentions: s.brandCount
      },
      meta: doc.meta,
      schema: buildSchema(doc, m)
    };
  }

  // ---------------------------------------------------------------------------
  // JSON-LD for publishing (Article + FAQPage)
  // ---------------------------------------------------------------------------

  function buildSchema(doc, m) {
    m = m || model(doc);
    var meta = doc.meta || {};
    var url = meta.slug ? 'https://www.virtualfrontdesk.com' + (String(meta.slug).charAt(0) === '/' ? '' : '/') + String(meta.slug).replace(/^https?:\/\/[^/]+/, '') : undefined;
    var article = {
      '@type': 'BlogPosting',
      headline: m.h1 || meta.seo_title,
      description: meta.meta_description,
      abstract: meta.ai_answer_summary,
      keywords: [meta.primary_keyword].concat(Array.isArray(meta.related_queries) ? meta.related_queries : []).filter(Boolean).join(', '),
      wordCount: m.words,
      author: meta.author ? { '@type': 'Person', name: meta.author, jobTitle: meta.author_title ? String(meta.author_title).replace(/,?\s*Virtual Front Desk$/i, '') : undefined, worksFor: { '@type': 'Organization', name: BRAND } } : undefined,
      publisher: { '@type': 'Organization', name: meta.publisher || BRAND, url: 'https://www.virtualfrontdesk.com/' },
      datePublished: meta.date_published || undefined,
      dateModified: meta.date_modified || meta.date_published || undefined,
      mainEntityOfPage: url,
      about: { '@type': 'SoftwareApplication', name: BRAND, applicationCategory: 'BusinessApplication', operatingSystem: 'Web browser' }
    };
    var graph = [article];
    if (m.faq && m.faq.items.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: m.faq.items.map(function (f) { return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; })
      });
    }
    return JSON.parse(JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }));
  }

  function check(input, opts) {
    opts = opts || {};
    var doc = opts.type === 'html' ? parseHtml(input, opts.DOMParser) : parseMarkdown(input);
    if (opts.meta) Object.keys(opts.meta).forEach(function (k) { if (opts.meta[k]) doc.meta[k] = opts.meta[k]; });
    return runChecks(doc);
  }

  return {
    version: '1.0.0', LIMITS: LIMITS,
    parseMarkdown: parseMarkdown, parseHtml: parseHtml, runChecks: runChecks, buildSchema: buildSchema, check: check,
    _internal: { sentences: sentences, wc: wc, syllables: syllables }
  };
});
