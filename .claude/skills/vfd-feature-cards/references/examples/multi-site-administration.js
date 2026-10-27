// Example: "Multi-site administration" card row on the VFD landing page.
// Paste scripts/vfd-kit.js above this. Media ids are from the showcase file.
// WARNING: visualLayer() replaces what's in a panel, so running this unchanged on the
// showcase file would erase designers' manual edits to these visuals.
// Shipped result: site tabs + stacked workflow cards / search + all-locations list + live toast /
// required document -> policy pill -> site chips with checks.
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('3382:8684'));
const W = 393, H = 455, out = {};
const centerSpan = (v) => {
  const ns = v.children.filter((n) => n.name !== 'connectors');
  const top = Math.min(...ns.map((n) => n.y)), bot = Math.max(...ns.map((n) => n.y + n.height));
  const d = Math.round((H - (bot - top)) / 2 - top); v.children.forEach((n) => { n.y += d; });
};
const divider = (parent, x, y, w) => { const l = figma.createRectangle(); l.name = 'divider'; l.resize(w, 1); l.fills = [solid(T.hairline)]; place(parent, l, x, y); };
const tag = (label, green = false) => { const r = row([txt(label, { size: 12, weight: 'Bold', color: green ? T.green : T.tagText })], { padX: 9, padY: 4, name: 'status' }); r.fills = [solid(green ? '#E3F6EE' : T.chip)]; r.cornerRadius = 999; return r; };

// 1. Location-specific workflows
{
  const v = await visualLayer('3558:45209', 'Location-specific workflows');
  const segs = ['HQ Lobby', 'Clinic', 'Warehouse'].map((s, i) => { const r = row([txt(s, { size: 14, weight: 'Bold', color: i === 1 ? '#FFFFFF' : T.muted })], { padX: 16, padY: 9, name: `tab/${s}` }); r.cornerRadius = 999; r.fills = i === 1 ? [solid(T.dark)] : []; return r; });
  const tabs = row(segs, { gap: 2, padX: 4, padY: 4, name: 'Site tabs' }); tabs.fills = [solid('#FFFFFF')]; tabs.cornerRadius = 999; tabs.effects = SH.float;
  place(v, tabs, (W - tabs.width) / 2, 0);
  const cardY = tabs.height + 40;
  const back = (w, o, dy, n) => { const b = box(w, 60, { name: n }); b.fills = [solid('#FFFFFF', o)]; b.effects = [shadow(2, 6, 0.03), shadow(10, 24, 0.05)]; place(v, b, (W - w) / 2, cardY - dy); };
  back(273, 0.5, 22, 'site card (back 2)'); back(297, 0.8, 11, 'site card (back 1)');
  const card = box(321, 274, { name: 'Clinic workflow' }); place(v, card, (W - 321) / 2, cardY);
  place(card, iconTile('building', { size: 36, bg: T.dark }), 18, 18);
  place(card, txt('Downtown Clinic', { size: 15, weight: 'Bold' }), 64, 18);
  place(card, txt('Sign-in workflow · 4 steps', { size: 13, weight: 'Medium', color: T.muted }), 64, 38);
  [['user', 'Visitor details'], ['shield', 'Health screening'], ['pen', 'Sign NDA'], ['printer', 'Print badge']].forEach(([ic, l], i) => {
    const y = 72 + i * 48; divider(card, 18, y, 285);
    place(card, iconTile(ic === 'shield' ? 'shieldCheck' : ic, { size: 30, bg: T.chip, fg: T.ink, radius: 8 }), 18, y + 9);
    place(card, txt(l, { size: 14, weight: 'Bold' }), 60, y + 14);
    const s = tag(i === 1 ? 'Clinic only' : 'Required', i === 1); place(card, s, 303 - s.width, y + 13);
  });
  centerSpan(v); out.v1 = v.id;
}

// 2. Central visitor records
{
  const v = await visualLayer('3576:60059', 'Central visitor records');
  const search = row([icon('search', 18, T.muted), txt('Search visitors across all sites', { size: 14, weight: 'Medium', color: T.muted })], { gap: 10, padX: 16, padY: 13, name: 'Search' });
  search.fills = [solid('#FFFFFF')]; search.cornerRadius = 999; search.effects = SH.float; search.primaryAxisSizingMode = 'FIXED'; search.resize(321, search.height);
  place(v, search, (W - 321) / 2, 0);
  const sites = [['HQ Lobby', 'New York', '128'], ['Downtown Clinic', 'Boston', '54'], ['Austin Office', 'Austin', '41'], ['Warehouse', 'Newark', '22']];
  const cardY = search.height + 14, card = box(321, 56 + sites.length * 50 + 30, { name: 'All locations' });
  place(v, card, (W - 321) / 2, cardY);
  place(card, txt('All locations', { size: 15, weight: 'Bold' }), 18, 20);
  const total = row([txt('245', { size: 13, weight: 'Bold' }), txt('today', { size: 13, weight: 'Medium', color: T.muted })], { gap: 4, name: 'total' }); place(card, total, 303 - total.width, 21);
  sites.forEach(([n, city, count], i) => {
    const y = 56 + i * 50; divider(card, 18, y, 285);
    place(card, iconTile('building', { size: 32, bg: T.chip, fg: T.ink, radius: 9 }), 18, y + 9);
    place(card, txt(n, { size: 14, weight: 'Bold' }), 60, y + 8);
    place(card, txt(city, { size: 12, weight: 'Medium', color: T.muted }), 60, y + 27);
    const d = figma.createEllipse(); d.name = 'live'; d.resize(7, 7); d.fills = [solid(T.green)];
    const c = row([d, txt(count, { size: 14, weight: 'Bold' })], { gap: 6, name: 'count' }); place(card, c, 303 - c.width, y + 16);
  });
  const t = row([initialsAvatar('Mia Chen', 1, 36), col([txt('Mia Chen signed in', { size: 14, weight: 'Bold' }), txt('Downtown Clinic · 09:40', { size: 12, weight: 'Medium', color: T.body })], { gap: 1 })], { gap: 10, padX: 12, padY: 10, name: 'Live sign-in toast' });
  t.fills = [solid('#FFFFFF')]; t.cornerRadius = 14; t.effects = SH.float;
  place(v, t, (W - 321) / 2 + 30, cardY + card.height - 24);
  centerSpan(v); out.v2 = v.id;
}

// 3. Consistent policies
{
  const v = await visualLayer('3576:60061', 'Consistent policies');
  const docW = 230, docH = 232, docY = 0;
  const doc = box(docW, docH, { name: 'Visitor NDA' });
  place(doc, iconTile('file', { size: 30, bg: T.dark, radius: 8 }), 16, 16);
  place(doc, txt('Visitor NDA', { size: 14, weight: 'Bold' }), 54, 15);
  place(doc, txt('v3 · Required document', { size: 11, weight: 'Medium', color: T.muted }), 54, 33);
  [190, 170, 184, 120].forEach((w, i) => { const r = figma.createRectangle(); r.name = 'text line'; r.resize(w, 6); r.cornerRadius = 3; r.fills = [solid(T.chip)]; place(doc, r, 16, 66 + i * 14); });
  const sig = figma.createNodeFromSvg('<svg width="110" height="40" viewBox="0 0 110 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 30c8-2 12-20 18-22s-2 24 6 22 10-16 15-14-3 14 4 13 9-9 14-9 3 7 9 7 12-6 18-8 10 2 16 1" stroke="#0A0A0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  sig.name = 'signature'; place(doc, sig, 16, 128);
  const sl = figma.createRectangle(); sl.name = 'signature line'; sl.resize(198, 1); sl.fills = [solid('#C9CCD0')]; place(doc, sl, 16, 172);
  place(doc, txt('Signed at check-in', { size: 11, weight: 'Medium', color: T.muted }), 16, 180); // pill overlaps the padding below this
  const pol = row([icon('shieldCheck', 16, '#FFFFFF'), txt('Required at all sites', { size: 13, weight: 'Bold', color: '#FFFFFF' })], { gap: 7, padX: 14, padY: 9, name: 'Policy pill' });
  pol.fills = [solid(T.green)]; pol.cornerRadius = 999; pol.effects = SH.float;
  const polY = docY + docH - pol.height / 2;
  const chips = ['HQ Lobby', 'Clinic', 'Warehouse'].map((s) => { const c = row([iconTile('check', { size: 20, bg: '#E3F6EE', fg: T.green, radius: 10 }), txt(s, { size: 14, weight: 'Bold' })], { gap: 8, padX: 12, padY: 10, name: `site/${s}` }); c.fills = [solid('#FFFFFF')]; c.cornerRadius = 12; c.effects = SH.float; return c; });
  const gap = 8, totalW = chips.reduce((a, c) => a + c.width, 0) + gap * 2, chipY = polY + pol.height + 64, from = Math.round(polY + pol.height);
  let x = (W - totalW) / 2; const cs = []; chips.forEach((c) => { cs.push(Math.round(x + c.width / 2)); x += c.width + gap; });
  const wires = figma.createNodeFromSvg(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">${cs.map((c) => `<path d="M${W / 2} ${from} C${W / 2} ${from + 34}, ${c} ${chipY - 34}, ${c} ${chipY}" stroke="#B9BEC4" stroke-width="1.5" stroke-dasharray="4 5"/>`).join('')}</svg>`);
  wires.name = 'connectors'; wires.fills = []; place(v, wires, 0, 0);
  place(v, doc, (W - docW) / 2, docY); place(v, pol, (W - pol.width) / 2, polY);
  x = (W - totalW) / 2; chips.forEach((c) => { place(v, c, x, chipY); x += c.width + gap; });
  centerSpan(v); out.v3 = v.id;
}
await (await figma.getNodeByIdAsync('3558:45204')).screenshot({ scale: 1.5 });
return out;
