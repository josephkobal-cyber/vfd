# VFD feature card design spec

Values come from the live landing page file (`VFD – UX/UI Showcase 2026`), so
they're more reliable than any screenshot. If the target file differs, trust the
file: read the card, panel and text styles with a quick `use_figma` read first.

## Card anatomy (1x canvas px)

| Part | Value |
|---|---|
| Section background | `#EDEFF1` |
| Card | 405 wide, white, radius 20, 1px stroke black @ 5%, padding 6 (top/sides) |
| Media panel (`image`) | 393 × 455, fill `#EDEFF1`, radius 15, clips content, no auto-layout |
| Caption (`description`) | 12 below the panel, 20px side padding |
| Tag pill (`Button`) | Manrope Bold 11.5, text `#58595A`, fill `#EFF1F3`, pad 5/11.5, fully rounded |
| Title | Manrope Bold 21, `#000000` |
| Body | Manrope Medium 14 / 150%, `#676767` |
| Row | 3 cards, ~33.5 gap, cards stretch to equal height |

## Inside-the-panel type scale (Manrope)
Floating UI is product UI shown at roughly 1:1. Keep it legible at website size.

| Role | Size / weight | Color |
|---|---|---|
| Surface title ("Visitor log", "All locations") | 15 Bold | `#0A0A0A` |
| Row primary text | 13–14 Bold/SemiBold | `#0A0A0A` |
| Row secondary text | 12–13 Medium | `#676767` or `#8B8D8F` |
| Column headers | 10 Bold, +6% letterspacing, caps | `#8B8D8F` |
| Chips / pills / code chips | 13–15 Bold/Medium | depends |
| Big metric | 32 Bold, −2% letterspacing | `#0A0A0A` |
| Minimum anywhere | 11 | |

## Color tokens
| Token | Hex | Use |
|---|---|---|
| green | `#15B87A` | live/active, accept call, success, primary highlight (also the hero tag color) |
| green tint | `#E3F6EE` | check badges, "+12%" deltas, success chips |
| red | `#EB4D4E` | decline/end call only |
| dark | `#171717` | primary dark buttons, active tab, key tiles, tooltips |
| ink | `#0A0A0A` | text on white |
| muted | `#8B8D8F` | secondary labels, inactive chips |
| chip | `#EFF1F3` | neutral tiles, tags, inactive pills |
| hairline | `#E4E6E8` | dividers, inactive chart bars |
| device | `#1C1C1E` | device bezels |
| code bg | `#1C1C1E` | dark code chips |
| code text / key / string | `#ABB1BF` / `#D09B66` / `#98C378` | One Dark colors from the API hero |

Use green for one highlight per visual (the active tab, today's bar, the live
status). If everything is green, nothing stands out.

## Surfaces and depth
- Floating surfaces: white, radius 14 (cards) / 16 (toasts) / 12 (chips) / full (pills).
- Shadow `float`: `0 2 6 rgba(16,20,31,.05)` + `0 16 40 rgba(16,20,31,.10)`.
- Shadow `device`: `0 24 60 rgba(16,20,31,.18)`.
- Glass pill over photos: white @ 62%, background blur 24, 1px white @ 70% stroke.
- Stacked "other items" behind a surface: same size minus 24px per layer,
  offset −11px upward, white @ 80% then 50%, softer shadow.
- Connectors: 1.5px dashed `#B9BEC4` (4/5 dash), cubic curves, drawn with
  `createNodeFromSvg` across the full panel so coordinates match the panel.
  Mark a merge or split point with a 12px green dot with a 3px white ring.

## Composition rules
- One hero plus 1–2 details. Three focal elements is the maximum.
- Center the composition's vertical span in the panel. Keep 24–40px of air at
  the edges unless something bleeds on purpose.
- Bleeding off one edge (a device, a wide table) signals "this is bigger than
  the card" and adds scale. Bleed only by a meaningful amount (30px+), never
  by a few pixels.
- A floating detail overlaps its surface by ~20px, onto padding only.
- Content inside a UI surface keeps 18px inner padding.
