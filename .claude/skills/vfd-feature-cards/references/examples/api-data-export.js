// Example: "API & data export" card row on the VFD landing page.
// Paste scripts/vfd-kit.js above this. Media ids are from the showcase file;
// swap in the ids you find with the title lookup in SKILL.md.
// WARNING: visualLayer() replaces what's in a panel, so running this unchanged on the
// showcase file would erase designers' manual edits to these visuals.
// Shipped result: table + export toast / API key scopes + code chip / sources -> dashboard.
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('3382:8684'));
const W = 393, H = 455, out = {};
const centerSpan = (v) => { // vertically center everything except full-panel connectors
  const ns = v.children.filter((n) => n.name !== 'connectors');
  const top = Math.min(...ns.map((n) => n.y)), bot = Math.max(...ns.map((n) => n.y + n.height));
  const d = Math.round((H - (bot - top)) / 2 - top); v.children.forEach((n) => { n.y += d; });
};
const divider = (parent, x, y, w) => { const l = figma.createRectangle(); l.name = 'divider'; l.resize(w, 1); l.fills = [solid(T.hairline)]; place(parent, l, x, y); };

// 1. Export visitor activity: wide table bleeding right + export toast on its bottom padding
{
  const v = await visualLayer('3576:60098', 'Export visitor activity');
  const card = box(400, 296, { name: 'Visitor log' }); place(v, card, 26, 0);
  place(card, txt('Visitor log', { size: 15, weight: 'Bold' }), 18, 18);
  place(card, txt('Today · HQ Lobby', { size: 12, weight: 'Medium', color: T.muted }), 18, 39);
  const exp = row([icon('download', 14, '#FFFFFF'), txt('Export', { size: 12, weight: 'SemiBold', color: '#FFFFFF' })], { gap: 6, padX: 12, padY: 8, name: 'Export button' });
  exp.fills = [solid(T.dark)]; exp.cornerRadius = 999; place(card, exp, 262, 20);
  [[18, 'VISITOR'], [168, 'HOST'], [268, 'SIGNED IN']].forEach(([x, l]) => place(card, txt(l, { size: 10, weight: 'Bold', color: T.muted, ls: 6 }), x, 74));
  [['Daniel Ortiz', 'Sarah Lee', '09:12'], ['Mia Chen', 'IT Support', '09:40'], ['Lucas Brown', 'Finance', '10:05'], ['Ava Patel', 'People Ops', '10:21']].forEach(([n, h, tm], i) => {
    const y = 96 + i * 46; divider(card, 0, y, 400);
    place(card, initialsAvatar(n, i), 18, y + 10);
    place(card, txt(n, { size: 13, weight: 'SemiBold' }), 52, y + 14);
    place(card, txt(h, { size: 13, weight: 'Medium', color: T.body }), 168, y + 14);
    place(card, txt(tm, { size: 13, weight: 'Medium', color: T.body }), 268, y + 14);
  });
  const check = iconTile('check', { size: 22, bg: '#E3F6EE', fg: T.green, radius: 11 });
  const t = row([iconTile('file'), col([txt('visitor-activity.csv', { size: 14, weight: 'Bold' }), txt('1,284 records exported', { size: 12, weight: 'Medium', color: T.body })], { gap: 2 }), check], { gap: 12, padX: 14, padY: 12, name: 'Export toast' });
  t.fills = [solid('#FFFFFF')]; t.cornerRadius = 16; t.effects = SH.float;
  place(v, t, 26, card.height - 22); // overlaps the table's bottom padding only
  centerSpan(v); out.v1 = v.id;
}

// 2. Build custom integrations: API key + scopes, dark code chip in the hero's colors
{
  const v = await visualLayer('3576:60107', 'Build custom integrations');
  const card = box(321, 314, { name: 'API key card' }); place(v, card, (W - 321) / 2, 0);
  place(card, iconTile('key', { size: 36, bg: T.dark }), 18, 18);
  place(card, txt('Reporting integration', { size: 15, weight: 'Bold' }), 64, 18);
  place(card, txt('API key · created 2 days ago', { size: 12, weight: 'Medium', color: T.muted }), 64, 38);
  const field = box(285, 40, { fill: '#F4F5F6', radius: 10, effects: [], name: 'key field' }); place(card, field, 18, 70);
  place(field, txt('vfd_live_••••••••••••3f9a', { size: 13, weight: 'SemiBold', color: '#3A3D40' }), 14, 11);
  place(field, icon('copy', 16, T.muted), 255, 12);
  place(card, txt('SCOPES', { size: 10, weight: 'Bold', color: T.muted, ls: 6 }), 18, 128);
  [['visits:read', 'Visit history and sign-ins', true], ['stations:read', 'Station status and activity', true], ['visitors:write', 'Create or edit visitors', false]].forEach(([s, d, on], i) => {
    const y = 148 + i * 48; if (i) divider(card, 18, y, 285);
    place(card, txt(s, { size: 13, weight: 'Bold', color: on ? T.ink : T.muted }), 18, y + 8);
    place(card, txt(d, { size: 12, weight: 'Medium', color: T.muted }), 18, y + 26);
    place(card, toggle(on), 271, y + 15);
  });
  const c = codeChip('GET', '/v1/visits', '200 OK'); place(v, c, (W - c.width) / 2, card.height - 20);
  centerSpan(v); out.v2 = v.id;
}

// 3. Combine front-desk data: three source chips -> connectors -> activity dashboard
{
  const v = await visualLayer('3576:60116', 'Combine front-desk data');
  const chips = [['Visitors', 'users'], ['Stations', 'screen'], ['Reception', 'headset']].map(([l, ic]) => {
    const c = row([iconTile(ic, { size: 24, bg: T.chip, fg: T.ink, radius: 7 }), txt(l, { size: 13, weight: 'Bold' })], { gap: 8, padX: 10, padY: 8, name: `source/${l}` });
    c.fills = [solid('#FFFFFF')]; c.cornerRadius = 12; c.effects = SH.float; return c;
  });
  const gap = 10, total = chips.reduce((a, c) => a + c.width, 0) + gap * 2, yTop = 44, yBot = yTop + chips[0].height, merge = 150;
  let x = (W - total) / 2; const cx = [];
  chips.forEach((c) => { cx.push(Math.round(x + c.width / 2)); x += c.width + gap; });
  const wires = figma.createNodeFromSvg(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">${cx.map((c) => `<path d="M${c} ${yBot} C${c} ${yBot + 40}, ${W / 2} ${merge - 40}, ${W / 2} ${merge}" stroke="#B9BEC4" stroke-width="1.5" stroke-dasharray="4 5"/>`).join('')}</svg>`);
  wires.name = 'connectors'; wires.fills = []; place(v, wires, 0, 0);
  x = (W - total) / 2; chips.forEach((c) => { place(v, c, x, yTop); x += c.width + gap; });
  const card = box(321, 268, { name: 'Activity dashboard' }); place(v, card, (W - 321) / 2, merge);
  const dot = figma.createEllipse(); dot.name = 'merge dot'; dot.resize(12, 12); dot.fills = [solid(T.green)]; dot.strokes = [solid('#FFFFFF')]; dot.strokeWeight = 3; dot.strokeAlign = 'OUTSIDE'; place(v, dot, W / 2 - 6, merge - 6);
  place(card, txt('Front-desk activity', { size: 13, weight: 'Bold' }), 18, 18);
  const wk = row([txt('This week', { size: 11, weight: 'SemiBold', color: T.tagText })], { padX: 10, padY: 5, name: 'range' }); wk.fills = [solid(T.chip)]; wk.cornerRadius = 999; place(card, wk, 303 - wk.width, 15);
  const big = txt('1,284', { size: 32, weight: 'Bold', ls: -2 }); place(card, big, 18, 44);
  const up = row([icon('trendUp', 12, T.green, 2.5), txt('12%', { size: 11, weight: 'Bold', color: T.green })], { gap: 4, padX: 8, padY: 4, name: 'delta' }); up.fills = [solid('#E3F6EE')]; up.cornerRadius = 999; place(card, up, 28 + big.width, 58);
  place(card, txt('visits across 9 stations', { size: 12, weight: 'Medium', color: T.muted }), 18, 88);
  const hs = [39, 59, 49, 71, 87, 25, 18], days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], barW = 26, step = (285 - barW) / 6, base = 236;
  hs.forEach((h, i) => {
    const b = figma.createRectangle(); b.name = `bar/${days[i]}`; b.resize(barW, h); b.topLeftRadius = b.topRightRadius = 6; b.bottomLeftRadius = b.bottomRightRadius = 2;
    b.fills = [solid(i === 4 ? T.green : T.hairline)]; place(card, b, 18 + i * step, base - h);
    const d = txt(days[i], { size: 11, weight: 'SemiBold', color: i === 4 ? T.ink : T.muted }); place(card, d, 18 + i * step + (barW - d.width) / 2, base + 8);
  });
  const tip = tooltip('312 visits'); place(card, tip, 18 + 4 * step + (barW - tip.width) / 2, base - 87 - tip.height - 6);
  out.v3 = v.id;
}
await (await figma.getNodeByIdAsync('3576:60095')).screenshot({ scale: 1.5 });
return out;
