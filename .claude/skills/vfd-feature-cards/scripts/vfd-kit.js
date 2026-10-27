// ===================== VFD FEATURE CARD KIT =====================
// Paste this whole file at the top of every use_figma script that builds or
// edits feature cards (use_figma keeps no state between calls). Then write
// your build code below the "BUILD" line. Every helper returns a Figma node.
// Sizes are 1x canvas pixels and match the live landing page file
// (card 405 wide, media panel 393x455). Delete helpers you don't use if the
// script gets close to use_figma's 50k character limit.

const T = {
  pageBg: '#EDEFF1',   // section background behind the cards
  card: '#FFFFFF',     // card surface
  media: '#EDEFF1',    // media panel background
  chip: '#EFF1F3',     // tag pill + inactive chips
  ink: '#0A0A0A',      // titles
  body: '#676767',     // card body copy (landing page value)
  tagText: '#58595A',  // tag pill text
  muted: '#8B8D8F',    // inactive chip text
  hairline: '#E4E6E8', // thin dividers / outlines
  green: '#15B87A',    // accept call, live, active status
  red: '#EB4D4E',      // decline / end call
  dark: '#171717',     // tooltips, primary dark buttons
  device: '#1C1C1E',   // device bezels
  fabric: '#5A5A5C',   // Neat Frame speaker base
};
const FONT = 'Manrope';
const CARD = { w: 405, pad: 6, mediaW: 393, mediaH: 455, radius: 20, mediaRadius: 15, gap: 33.5 };

const hex = (h) => { h = h.replace('#', ''); return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 }; };
const solid = (h, opacity = 1) => ({ type: 'SOLID', color: hex(h), opacity });
const shadow = (y, blur, a, spread = 0) => ({ type: 'DROP_SHADOW', color: { r: 0.06, g: 0.08, b: 0.12, a }, offset: { x: 0, y }, radius: blur, spread, visible: true, blendMode: 'NORMAL' });
const SH = {
  card: [shadow(1, 3, 0.04)],
  float: [shadow(2, 6, 0.05), shadow(16, 40, 0.10)],   // floating UI chips, toasts
  device: [shadow(24, 60, 0.18)],                      // devices sitting in the panel
};
const blur = (radius = 24) => ({ type: 'BACKGROUND_BLUR', radius, visible: true });

await Promise.all(['Regular', 'Medium', 'SemiBold', 'Bold'].map((style) => figma.loadFontAsync({ family: FONT, style })));

// ---------- text ----------
function txt(chars, { size = 16, weight = 'Regular', color = T.ink, lh = null, ls = 0, width = null, align = 'LEFT', opacity = 1 } = {}) {
  const t = figma.createText();
  t.fontName = { family: FONT, style: weight };
  t.characters = chars;
  t.fontSize = size;
  t.fills = [solid(color, opacity)];
  t.textAlignHorizontal = align;
  if (lh) t.lineHeight = { unit: 'PERCENT', value: lh };
  if (ls) t.letterSpacing = { unit: 'PERCENT', value: ls };
  if (width) { t.resize(width, t.height); t.textAutoResize = 'HEIGHT'; } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.name = chars.slice(0, 40);
  return t;
}

// ---------- icons (Lucide-style 24px stroke paths) ----------
const ICONS = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  phoneDown: '<g transform="rotate(135 12 12)"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></g>',
  video: '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  badge: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M15 9h3M15 13h3M6 16c.6-1.2 1.7-2 3-2s2.4.8 3 2"/>',
  printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
  sparkle: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>',
  screen: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
  chart: '<path d="M3 3v18h18"/><path d="M8 17V9M13 17V5M18 17v-3"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  trendUp: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  shieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
};
function icon(name, size = 20, color = T.ink, strokeWidth = 2) {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${ICONS[name]}</svg>`;
  const n = figma.createNodeFromSvg(svg);
  n.name = `icon/${name}`;
  n.fills = [];
  return n;
}

// ---------- layout helpers ----------
function row(children = [], { gap = 8, padX = 0, padY = 0, align = 'CENTER', name = 'row' } = {}) {
  const f = figma.createAutoLayout('HORIZONTAL', { name, itemSpacing: gap });
  f.paddingLeft = f.paddingRight = padX; f.paddingTop = f.paddingBottom = padY;
  f.counterAxisAlignItems = align; f.fills = [];
  children.forEach((c) => f.appendChild(c));
  return f;
}
function col(children = [], { gap = 8, padX = 0, padY = 0, align = 'MIN', name = 'col' } = {}) {
  const f = figma.createAutoLayout('VERTICAL', { name, itemSpacing: gap });
  f.paddingLeft = f.paddingRight = padX; f.paddingTop = f.paddingBottom = padY;
  f.counterAxisAlignItems = align; f.fills = [];
  children.forEach((c) => f.appendChild(c));
  return f;
}
// Place a node inside a (non auto-layout) media panel at x/y. Negative or
// overflowing values are fine: the panel clips, which is how devices "bleed".
function place(parent, node, x, y) { parent.appendChild(node); node.x = Math.round(x); node.y = Math.round(y); return node; }
function center(parent, node, dx = 0, dy = 0) { return place(parent, node, (parent.width - node.width) / 2 + dx, (parent.height - node.height) / 2 + dy); }

// Gray rectangle that will receive a photo later (generate_image or upload_assets
// with this node's id). Name it after what the photo should show.
function imageSlot(name, w, h, radius = 0) {
  const r = figma.createRectangle();
  r.name = `IMG: ${name}`; r.resize(w, h); r.cornerRadius = radius; r.fills = [solid('#D5D8DC')];
  return r;
}

// ---------- floating UI ----------
// Tag/status pill. variant: 'glass' (frosted, over photos), 'white' (floating), 'chip' (flat gray, inactive)
function pill(label, { variant = 'white', iconName = null, iconColor = T.green, dot = null, size = 'md', textColor = null } = {}) {
  const s = size === 'lg' ? { fs: 18, px: 22, py: 14, gap: 12, ic: 22 } : size === 'sm' ? { fs: 13, px: 12, py: 7, gap: 6, ic: 14 } : { fs: 15, px: 16, py: 10, gap: 8, ic: 18 };
  const kids = [];
  if (dot) { const d = figma.createEllipse(); d.resize(10, 10); d.fills = [solid(dot)]; d.name = 'status-dot'; kids.push(d); }
  if (iconName) kids.push(icon(iconName, s.ic, iconColor));
  const tc = textColor || (variant === 'chip' ? T.muted : T.ink);
  kids.push(txt(label, { size: s.fs, weight: 'Medium', color: tc }));
  const p = row(kids, { gap: s.gap, padX: s.px, padY: s.py, name: `pill/${label}` });
  p.cornerRadius = 999;
  if (variant === 'glass') { p.fills = [solid('#FFFFFF', 0.62)]; p.strokes = [solid('#FFFFFF', 0.7)]; p.strokeWeight = 1; p.effects = [blur(24), ...SH.float]; p.cornerRadius = 20; }
  else if (variant === 'chip') { p.fills = [solid('#FFFFFF', 0.55)]; p.strokes = [solid('#FFFFFF', 0.9)]; p.strokeWeight = 1.5; p.effects = [shadow(4, 14, 0.04)]; p.cornerRadius = 14; }
  else { p.fills = [solid('#FFFFFF')]; p.effects = SH.float; p.cornerRadius = 16; }
  return p;
}
// Round action button: kind 'accept' | 'decline' | 'pause' | 'neutral' | 'dark'
function callButton(kind = 'accept', size = 48, iconName = null) {
  const map = { accept: [T.green, 'phone', '#FFFFFF'], decline: [T.red, 'phoneDown', '#FFFFFF'], pause: ['#C9CCD0', 'pause', '#FFFFFF'], neutral: ['#FFFFFF', iconName || 'video', T.ink], dark: [T.dark, iconName || 'card', '#FFFFFF'] };
  const [bg, ic, fg] = map[kind];
  const f = row([icon(iconName || ic, Math.round(size * 0.45), fg)], { name: `btn/${kind}` });
  f.primaryAxisAlignItems = 'CENTER'; f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED';
  f.resize(size, size); f.cornerRadius = size / 2; f.fills = [solid(bg)];
  return f;
}
// Badge pinned to a corner of a thumbnail/avatar: colored circle + white ring.
function badge(kind = 'accept', size = 40) {
  const b = callButton(kind, size);
  b.strokes = [solid('#FFFFFF')]; b.strokeWeight = Math.max(3, size * 0.08); b.strokeAlign = 'OUTSIDE';
  b.effects = [shadow(4, 12, 0.12)];
  return b;
}
// Circle avatar. Pass imageHash to fill with a photo, else initials on gray.
function avatar(size = 48, { imageHash = null, initials = '', ring = false } = {}) {
  const f = figma.createFrame();
  f.name = 'avatar'; f.resize(size, size); f.cornerRadius = size / 2; f.clipsContent = true;
  f.fills = imageHash ? [{ type: 'IMAGE', imageHash, scaleMode: 'FILL' }] : [solid('#D5D8DC')];
  if (!imageHash && initials) { const t = txt(initials, { size: size * 0.38, weight: 'SemiBold', color: '#FFFFFF' }); f.appendChild(t); t.x = (size - t.width) / 2; t.y = (size - t.height) / 2; }
  if (ring) { f.strokes = [solid('#FFFFFF')]; f.strokeWeight = Math.max(3, size * 0.05); f.effects = [shadow(8, 24, 0.12)]; }
  return f;
}
// White notification/toast card: optional avatar or icon tile, title, optional subtitle.
function toast(title, { subtitle = null, avatarNode = null, iconName = null, iconBg = T.green, width = null } = {}) {
  const kids = [];
  if (avatarNode) kids.push(avatarNode);
  else if (iconName) kids.push(iconTile(iconName, { bg: iconBg }));
  const lines = [txt(title, { size: 15, weight: 'Bold', color: T.ink })];
  if (subtitle) lines.push(txt(subtitle, { size: 13, weight: 'Medium', color: T.body }));
  kids.push(col(lines, { gap: 2 }));
  const t = row(kids, { gap: 12, padX: 14, padY: 12, name: `toast/${title}` });
  t.fills = [solid('#FFFFFF', 0.96)]; t.cornerRadius = 16; t.effects = SH.float;
  if (width) { t.primaryAxisSizingMode = 'FIXED'; t.resize(width, t.height); }
  return t;
}
// Small dark label (tooltips, chart callouts).
function tooltip(label) {
  const body = row([txt(label, { size: 13, weight: 'Bold', color: '#FFFFFF' })], { padX: 10, padY: 6, name: 'tooltip' });
  body.fills = [solid(T.dark)]; body.cornerRadius = 8;
  return body;
}
// Dashed circle used for orbit / routing diagrams.
function orbit(d, color = '#FFFFFF') {
  const e = figma.createEllipse(); e.name = 'orbit'; e.resize(d, d); e.fills = [];
  e.strokes = [solid(color)]; e.strokeWeight = 2; e.dashPattern = [6, 8];
  return e;
}

// ---------- devices ----------
// Neat Frame (the VFD station): portrait black glass with camera pill, optional fabric base.
// Returns {node, screen}; fill `screen` with a photo or put UI inside it.
function neatFrame(w = 300, { base = false, screenColor = '#2A2A2C' } = {}) {
  const h = Math.round(w * 1.42), bez = Math.round(w * 0.065), topBez = Math.round(w * 0.14);
  const dev = figma.createFrame(); dev.name = 'Neat Frame'; dev.resize(w, h + (base ? Math.round(w * 0.3) : 0));
  dev.fills = []; dev.clipsContent = false;
  const body = figma.createRectangle(); body.name = 'bezel'; body.resize(w, h); body.cornerRadius = Math.round(w * 0.035);
  body.fills = [solid(T.device)]; body.effects = SH.device; dev.appendChild(body);
  const cam = figma.createRectangle(); cam.name = 'camera'; cam.resize(Math.round(w * 0.2), Math.round(w * 0.065)); cam.cornerRadius = 999;
  cam.fills = [solid('#0E0E10')]; cam.strokes = [solid('#9A9CA0')]; cam.strokeWeight = 1.5;
  dev.appendChild(cam); cam.x = (w - cam.width) / 2; cam.y = Math.round((topBez - cam.height) / 2);
  const screen = figma.createFrame(); screen.name = 'screen'; screen.resize(w - bez * 2, h - topBez - bez); screen.cornerRadius = 4;
  screen.fills = [solid(screenColor)]; screen.clipsContent = true; dev.appendChild(screen); screen.x = bez; screen.y = topBez;
  if (base) { const fab = figma.createRectangle(); fab.name = 'fabric base'; fab.resize(w, Math.round(w * 0.3)); fab.y = h - 2; fab.fills = [solid(T.fabric)]; fab.bottomLeftRadius = fab.bottomRightRadius = Math.round(w * 0.03); dev.appendChild(fab); }
  return { node: dev, screen };
}
// Modern phone, portrait. Returns {node, screen}.
function phone(w = 150, { screenColor = '#101012' } = {}) {
  const h = Math.round(w * 2.05), bez = Math.max(5, Math.round(w * 0.035));
  const dev = figma.createFrame(); dev.name = 'Phone'; dev.resize(w, h); dev.cornerRadius = Math.round(w * 0.17);
  dev.fills = [solid('#0B0B0C')]; dev.strokes = [solid('#C9CCD0')]; dev.strokeWeight = 2; dev.effects = SH.device; dev.clipsContent = true;
  const screen = figma.createFrame(); screen.name = 'screen'; screen.resize(w - bez * 2, h - bez * 2); screen.cornerRadius = Math.round(w * 0.14);
  screen.fills = [solid(screenColor)]; screen.clipsContent = true; dev.appendChild(screen); screen.x = bez; screen.y = bez;
  const island = figma.createRectangle(); island.name = 'island'; island.resize(Math.round(w * 0.3), Math.round(w * 0.085)); island.cornerRadius = 999; island.fills = [solid('#000000')];
  dev.appendChild(island); island.x = (w - island.width) / 2; island.y = bez + Math.round(w * 0.04);
  return { node: dev, screen };
}
// Laptop seen from the front. Returns {node, screen}. Usually placed so it bleeds off one side.
function laptop(w = 430, { screenColor = '#1B2433' } = {}) {
  const sh = Math.round(w * 0.62), bez = Math.round(w * 0.022);
  const dev = figma.createFrame(); dev.name = 'Laptop'; dev.resize(w * 1.08, sh + Math.round(w * 0.05)); dev.fills = []; dev.clipsContent = false;
  const lid = figma.createRectangle(); lid.name = 'lid'; lid.resize(w, sh); lid.cornerRadius = Math.round(w * 0.03); lid.fills = [solid('#0E0E10')]; lid.effects = SH.device;
  dev.appendChild(lid); lid.x = w * 0.04;
  const screen = figma.createFrame(); screen.name = 'screen'; screen.resize(w - bez * 2, sh - bez * 2); screen.cornerRadius = Math.round(w * 0.015);
  screen.fills = [solid(screenColor)]; screen.clipsContent = true; dev.appendChild(screen); screen.x = w * 0.04 + bez; screen.y = bez;
  const deck = figma.createRectangle(); deck.name = 'base'; deck.resize(w * 1.08, Math.round(w * 0.028)); deck.y = sh; deck.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]], gradientStops: [{ position: 0, color: { ...hex('#E6E7E9'), a: 1 } }, { position: 1, color: { ...hex('#A9ACB0'), a: 1 } }] }];
  deck.bottomLeftRadius = deck.bottomRightRadius = Math.round(w * 0.02); dev.appendChild(deck);
  return { node: dev, screen };
}

// ---------- card shell ----------
// Find or create the gray section that holds a row of cards.
function ensureSection(name = 'Feature cards') {
  let s = figma.currentPage.children.find((n) => n.type === 'FRAME' && n.name === name);
  if (s) return s;
  let maxX = 0; for (const c of figma.currentPage.children) maxX = Math.max(maxX, c.x + c.width);
  s = figma.createAutoLayout('HORIZONTAL', { name, itemSpacing: CARD.gap });
  s.paddingLeft = s.paddingRight = s.paddingTop = s.paddingBottom = 48;
  s.counterAxisAlignItems = 'MIN'; s.fills = [solid(T.pageBg)];
  s.x = maxX ? maxX + 200 : 0; s.y = 0;
  return s;
}
// Build one card inside `section`, matching the landing page cards. Returns
// {card, media}. `media` is a plain clipped frame (no auto-layout): compose the
// visual inside it with visualLayer()/place()/center().
function featureCard(section, { tag, title, body, name = null }) {
  const card = figma.createAutoLayout('VERTICAL', { name: name || 'INDUSTRY CARD', itemSpacing: 12 });
  card.paddingLeft = card.paddingRight = card.paddingTop = CARD.pad; card.paddingBottom = 20;
  card.fills = [solid(T.card)]; card.cornerRadius = CARD.radius; card.strokes = [solid('#000000', 0.05)]; card.strokeWeight = 1;
  card.primaryAxisSizingMode = 'AUTO'; card.counterAxisSizingMode = 'FIXED'; card.resize(CARD.w, card.height);
  section.appendChild(card); card.layoutSizingVertical = 'FILL';
  const media = figma.createFrame(); media.name = 'image'; media.resize(CARD.mediaW, CARD.mediaH);
  media.cornerRadius = CARD.mediaRadius; media.fills = [solid(T.media)]; media.clipsContent = true;
  card.appendChild(media);
  const tagPill = row([txt(tag, { size: 11.5, weight: 'Bold', color: T.tagText })], { padX: 11.5, padY: 5, name: 'Button' });
  tagPill.fills = [solid(T.chip)]; tagPill.cornerRadius = 999;
  const textW = CARD.mediaW - 40;
  const titleT = txt(title, { size: 21, weight: 'Bold', color: '#000000', width: textW }); titleT.name = 'title';
  const bodyT = txt(body, { size: 14, weight: 'Medium', color: T.body, lh: 150, width: textW }); bodyT.name = 'body';
  const caption = col([tagPill], { gap: 10, padX: 20, name: 'description' });
  card.appendChild(caption); caption.layoutSizingHorizontal = 'FILL';
  caption.appendChild(titleT); caption.appendChild(bodyT);
  titleT.layoutSizingHorizontal = 'FILL'; bodyT.layoutSizingHorizontal = 'FILL';
  return { card, media };
}

// ---------- panel visuals ----------
// Plain frame helper for floating UI surfaces (tables, settings cards, dashboards).
function box(w, h, { fill = '#FFFFFF', radius = 14, effects = SH.float, name = 'box', clip = true } = {}) {
  const f = figma.createFrame(); f.name = name; f.resize(w, h); f.cornerRadius = radius;
  f.fills = fill ? [solid(fill)] : []; f.effects = effects; f.clipsContent = clip; return f;
}
// Get a clean "Visual / <name>" layer inside an existing media panel. Removes a
// previous Visual layer first, so re-running a build replaces instead of stacking.
async function visualLayer(mediaId, name) {
  const media = await figma.getNodeByIdAsync(mediaId);
  media.children.filter((c) => c.name.startsWith('Visual /')).forEach((c) => c.remove());
  const v = figma.createFrame(); v.name = `Visual / ${name}`; v.resize(media.width, media.height);
  v.fills = []; v.clipsContent = false; media.appendChild(v); v.x = 0; v.y = 0; return v;
}
// Pastel initials avatar for tables and lists (no photo needed).
const AV = ['#F6D9C6', '#D6E4F5', '#DCEFD9', '#EADCF5'];
function initialsAvatar(fullName, i = 0, size = 26) {
  const a = box(size, size, { fill: AV[i % AV.length], radius: size / 2, effects: [], name: 'avatar' });
  const t = txt(fullName.split(' ').map((p) => p[0]).join(''), { size: Math.round(size * 0.38), weight: 'Bold', color: '#3A3D40' });
  a.appendChild(t); t.x = (size - t.width) / 2; t.y = (size - t.height) / 2; return a;
}
// On/off switch for settings and permission rows.
function toggle(on, w = 32) {
  const h = Math.round(w * 0.56), k = h - 4;
  const t = box(w, h, { fill: on ? T.green : '#D5D8DC', radius: h / 2, effects: [], name: on ? 'toggle/on' : 'toggle/off' });
  const knob = figma.createEllipse(); knob.resize(k, k); knob.fills = [solid('#FFFFFF')]; knob.effects = [shadow(1, 2, 0.15)];
  t.appendChild(knob); knob.x = on ? w - k - 2 : 2; knob.y = 2; return t;
}
// Dark API/code chip in the hero's One Dark colors, e.g. codeChip('GET', '/v1/visits', '200 OK').
const CODE = { bg: '#1C1C1E', text: '#ABB1BF', key: '#D09B66', string: '#98C378' };
function codeChip(method, path, status, size = 15) {
  const dot = figma.createEllipse(); dot.resize(8, 8); dot.fills = [solid(T.green)];
  const c = row([txt(method, { size, weight: 'Bold', color: CODE.key }), txt(path, { size, weight: 'SemiBold', color: CODE.text }), dot, txt(status, { size, weight: 'Bold', color: CODE.string })], { gap: 8, padX: 16, padY: 14, name: 'API response' });
  c.fills = [solid(CODE.bg)]; c.cornerRadius = 12; c.effects = SH.float; return c;
}
// Small tinted square holding an icon (file tiles, key tiles, source chips).
function iconTile(name, { size = 40, bg = T.green, fg = '#FFFFFF', radius = 10 } = {}) {
  const t = box(size, size, { fill: bg, radius, effects: [], name: `tile/${name}` });
  const i = icon(name, Math.round(size * 0.5), fg); t.appendChild(i); i.x = i.y = Math.round(size * 0.25); return t;
}
// ===================== BUILD (your code below) =====================
