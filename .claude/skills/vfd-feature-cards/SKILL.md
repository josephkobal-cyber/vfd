---
name: vfd-feature-cards
description: Design feature explainer card visuals and guided-tour tooltips for the Virtual Front Desk (VFD) website directly in Figma via the Figma connector. Use this whenever the user wants visuals, illustrations, mockups or "images" for VFD feature cards, landing page card rows, empty card media panels, product feature tiles, or any website section that explains a VFD capability (reception, live video, routing, check-in, documents, payments, API/data export, multi-site, notifications, integrations, hardware). Also use when the user shares a figma.com link to the VFD landing page / UX-UI Showcase and asks to fill, create or redo card visuals, or says things like "create 3 visuals for this section", "fill these cards", "make a visual like our other feature cards", or wants a wizard/walkthrough/onboarding tooltip explaining sign-in steps — even if they don't say "skill" or "explainer".
---

# VFD feature card visuals

Each VFD feature card is a white card with a light-grey media panel on top and a
caption below (tag pill, bold title, one-line description). The media panel holds
a small, calm product story: **one hero element** (a device, a product UI surface,
or a person) plus **one or two floating UI details** that make the feature
obvious at a glance. Look at `assets/reference-row-*.webp` once to calibrate the
style before designing.

The visuals are built as **editable Figma layers** (frames, text, vectors), not
flattened images, so designers can tweak copy and spacing afterward. Photos are
used only where a real person or place is the point of the card.

## Workflow

### 1. Find the target and read the room
- Parse the Figma URL (`node-id=3382-8684` → `3382:8684`), call `create_session`,
  and load the `figma-use` skill (plus `figma-generate-design`) before any
  `use_figma` call. Pass both names in `skillNames`.
- `get_metadata` on a whole landing page is often >400k characters. Instead,
  find the cards by their titles with a read-only `use_figma` (layer names are
  generic, like `title` or `image`, so match on `characters`):
  ```js
  await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('PAGE_OR_CANVAS_ID'));
  const titles = ['Card title 1', 'Card title 2', 'Card title 3'];
  const hits = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] })
    .filter((t) => titles.includes(t.characters.trim()));
  return hits.map((t) => {
    let card = t; while (card && card.name !== 'INDUSTRY CARD') card = card.parent;
    const media = card && card.findOne((n) => n.name === 'image');
    return { title: t.characters, cardId: card?.id, rowId: card?.parent?.id, mediaId: media?.id,
             w: media?.width, h: media?.height, empty: media ? media.children.length === 0 : null };
  });
  ```
  If the card naming differs, climb parents until you reach a frame with a
  ~393×455 child, and adjust.
- Screenshot one **finished** card row on the same page and the section's hero
  (the dark banner above the cards). Reuse the hero's motifs: the API section's
  code colors went into a dark "GET /v1/visits · 200 OK" chip, which tied the
  cards to their banner.
- If there are no cards yet, build them with `ensureSection()` + `featureCard()`
  from the kit.

### 2. Concept before pixels
For each card write one sentence: *"Hero: X. Detail: Y. It shows <the claim in
the description>."* Pick a pattern from `references/visual-patterns.md`, and
don't reuse the same pattern twice in one row (vary between list card, diagram,
device and photo). Tell the user the three ideas in a short list, then build
without waiting unless they asked to approve first.

Good concepts are **literal and specific**: real-looking names, times, counts,
file names (`visitor-activity.csv`, `vfd_live_••••3f9a`, `Downtown Clinic · 09:40`).
Never ship lorem ipsum or "Lorem" chips inside the visual.

### 3. Build
- Paste `scripts/vfd-kit.js` at the top of the script, then your build code.
  `use_figma` keeps no state between calls and caps scripts at 50k characters.
  If you're close to the limit, drop unused helpers and icons; the kit is ~23k.
- Put each visual in its own layer via `await visualLayer(mediaId, 'Name')`.
  It removes an older `Visual / …` layer first, so re-running replaces the
  visual instead of stacking duplicates.
- Build all cards of a row in **one call**, then screenshot the row's grid
  (`await gridNode.screenshot({ scale: 1.5 })`) in that same call.
- Size everything for the real panel (393×455 on the landing page). See the
  type scale in `references/design-spec.md`.

### 4. Review the screenshot (this is where quality comes from)
Check, in this order:
1. **Overlap**: a floating element (toast, chip, code chip) may cover the
   *padding* of the surface under it, never its text. Fix it by giving the
   surface ~20px extra bottom padding, then set the overlap to that padding.
   Both test runs needed this fix.
2. **Balance**: the composition's vertical span should be centered in the panel
   (compute min/max y of the children and shift). Leave at least 24px of air
   at the panel edges unless an element deliberately bleeds off.
3. **Legibility**: no text under 11px; chip and label text 13–15px. The user
   bumped a 12px code chip to 15px, so small floating text reads as a defect.
4. **Row consistency**: same shadow, radius and type scale across the three
   cards. Each card should have one clear focal point.
5. **Truth**: the visual shows what the card's description claims. Nothing
   contradicts the copy.

Fix with one targeted script that moves or resizes the specific nodes (find
them by name inside the `Visual /` layer), then take one more screenshot. Don't
rebuild from scratch for small fixes.

### 5. Photos (only when a person or place is the point)
- Product hardware: draw it with `neatFrame()`, `phone()`, `laptop()`. Device
  renders also live in `production/references/` in the VFD repo.
- People: put an `imageSlot()` where the photo goes, then fill it with
  `generate_image` (pass `nodeId`; it costs Figma AI credits, so tell the user)
  or with `upload_assets` from a local file (`nodeIds` = the slot ids).
  Photo direction is in `references/visual-patterns.md`.

### 6. Hand off
Tell the user what each visual shows in a sentence each, mention any credits
used, and link the node. Expect them to adjust things in Figma. When they do,
read back what changed before editing again, and keep their changes. Their
edits show you what to do next time.

## Icons
The kit ships Lucide-style stroke icons for speed. The team's own visuals use
**specific Phosphor-style icons** (e.g. a designer swapped a generic file icon
for `FileCsv`). Pick the most specific icon for the idea. If the file already
contains a better icon (check finished cards nearby), clone it instead of
drawing one with the kit.

## Figma API gotchas seen in practice
- Switch pages with `await figma.setCurrentPageAsync(page)` once per call. The
  landing page canvas id is the `node-id` from the URL.
- Manrope styles are `Regular | Medium | SemiBold | Bold` (no space). Inter uses
  `Semi Bold`.
- Effect colors take `{r,g,b,a}`, but paint colors take only `{r,g,b}` plus a
  paint-level `opacity`.
- `createNodeFromSvg` returns a frame. Set `.fills = []` on it, and put stroke
  colors directly in the SVG string.
- Auto-layout `FILL`/`HUG` only work after the node is appended to an
  auto-layout parent.
- When the user edits in Figma at the same time, node sizes can differ from your
  script's assumptions. Read the current values before applying fixes.

## Files
- `scripts/vfd-kit.js`: tokens, text/icon helpers, floating UI, devices, card shell.
- `references/design-spec.md`: exact colors, sizes, type scale, shadows.
- `references/visual-patterns.md`: pattern catalog with examples, photo direction, and
  the walkthrough-tooltip pattern (pattern F) for step-by-step tours over a product screen.
- `references/examples/*.js`: full build scripts for two shipped rows (API & data
  export; multi-site administration). Copy them as starting points.
- `assets/reference-row-*.webp`: the original nine reference cards.
