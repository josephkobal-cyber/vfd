# Visual pattern catalog

Pick the pattern that makes the card's claim most literal. Within one row of
three, use different patterns so the row has rhythm.

## A. Device hero (hardware, live video, station features)
A Neat Frame, phone or laptop as the hero, often bleeding off the bottom or one
side, with a photo or UI on its screen and one floating detail on top.
- *Live video calls*: Neat Frame with a smiling receptionist (headset) on screen,
  plus a glass pill "Live receptionist" with a green video icon.
- *Microsoft Teams-connected reception*: laptop bleeding off the left, with an
  incoming-call toast "Virtual Front Desk is calling you" (video/phone/decline
  buttons).
- *Mobile response*: App Store and Google Play badges above two phones (incoming
  call screen with accept/decline, then an active video call).
- *Phone and video options*: two overlapping Neat Frames, one with a person and
  one with a dial pad ("Call status · Calling… 00:05", red End call).
Kit: `neatFrame()`, `phone()`, `laptop()`, `pill({variant:'glass'})`, `callButton()`.

## B. Photo hero (people-first features)
A full-bleed photo with 1–3 small floating UI chips.
- *Remote receptionist support*: receptionist at a laptop, with building
  thumbnails along the bottom (one with a green call badge, one paused).
- *Visitor check-in*: senior visitor talking to a Neat device (photo only, no UI).
- *Effortless remote payments*: man on a video call, PiP receptionist, toolbar
  with a black "Request Payment" button and a dark tooltip.
Photo direction: warm natural daylight, modern office or clinic, real-looking
diverse people, receptionists with a headset, genuine smile, shallow depth of
field, no readable signage. Fill an `imageSlot()` with `generate_image` (costs
credits) or `upload_assets`.

## C. Diagram (routing, relationships, flows)
Abstract shapes on the grey panel: a center node with satellites, or sources
fanning in or out along dashed connectors.
- *Employee and team routing*: avatar in the center with a green call badge, a
  dashed orbit, department chips around it ("Sales" active with a green dot,
  others faded).
- *Combine front-desk data*: Visitors / Stations / Reception chips → dashed
  connectors → one "Front-desk activity" dashboard (1,284 visits, +12%, weekly
  bars with Friday in green and a "312 visits" callout).
- *Consistent policies*: "Visitor NDA" document → green "Required at all sites"
  pill → connectors → HQ Lobby / Clinic / Warehouse chips with green checks.
Kit: `orbit()`, `avatar()`, `badge()`, `pill({variant:'chip'})`, SVG connectors.

## D. Product UI surface (admin, data, settings features)
A white UI card showing the feature's actual screen, simplified, plus one
floating result or detail that overlaps its bottom edge.
- *Export visitor activity*: "Visitor log" table (initials avatars, host, time)
  with a dark Export button. Toast: CSV file tile, "visitor-activity.csv ·
  1,284 records exported", green check.
- *Build custom integrations*: API key card (masked key + copy, scopes with
  toggles: two reads on, one write off), plus a dark code chip "GET /v1/visits ·
  200 OK" in the hero's code colors.
- *Location-specific workflows*: site tabs (HQ Lobby / **Clinic** / Warehouse)
  above stacked cards. The front card "Downtown Clinic · 4 steps" lists steps
  with "Required" tags and one green "Clinic only" tag.
- *Central visitor records*: "Search visitors across all sites" bar, an "All
  locations · 245 today" list with green live dots, and a toast "Mia Chen signed
  in · Downtown Clinic · 09:40".
Kit: `box()`, `initialsAvatar()`, `toggle()`, `codeChip()`, `iconTile()`, `toast()`.

## E. Document / outcome (forms, signatures, compliance)
A document cropped by the panel edge with a signature, plus a success toast.
- *Documents and signatures*: agreement text with a signature ("Bruce Cox ·
  Nov 12th, 2024"), plus a toast with an avatar: "Document signed!"
Kit: grey `text line` rectangles, an SVG signature path, `toast()`.

## Choosing quickly
| The card says… | Start with |
|---|---|
| visitors talk to / see a person | B (or A with a photo on the screen) |
| works on hardware X | A |
| routes, connects, combines, syncs | C |
| configure, manage, export, review, admin | D |
| sign, upload, approve, comply | E (or C if it applies "across" things) |

## F. Walkthrough tooltip (guided tours over a product screen)
Use this when a section shows one product screen (e.g. the iPad "How can we help
you today?" welcome screen) and the story is a sequence of steps. Don't fill a
card panel here. Instead, layer a tour tooltip over the existing screen.
- The landing page file has a **`Wizard tooltip`** component set: variants
  `Pointer=Left|Right|Top|Bottom`, TEXT props `Title`, `Body`, `Step`,
  `Next label`, and BOOLEAN `Show back`. Search the page for it and instance it
  instead of drawing a new one.
- Anatomy: white card, radius 16, 340 wide; title Manrope Bold 17 ending with a
  colon ("Start sign-in:"); body Medium 15 `#4A4D50`; footer with a muted step
  counter ("1/7") on the left and Back (text) plus Next (dark `#171717` pill) on
  the right; a small rounded triangle pointer facing the target.
- Point at the exact element the step is about, with a 12px gap. Mark the
  target with a 2px green (`#15B87A`) focus ring, 6px outside the element.
- Step 1 hides Back. The last step sets `Next label` to "Done".
- Name layers `Wizard / step N` and `Wizard / step N focus ring` so steps can be
  found and wired up later in prototype mode (Next → step N+1, Back → step N−1).
- Real VFD sign-in flow (confirmed with the team, use this order): 1 Start
  sign-in (welcome screen) → 2 Choose visitor type → 3 Choose how to sign in
  (at station / pre-registered) → 4 Enter details (name, company, email,
  mobile) → 5 Review documents → 6 Sign documents → 7 Take a photo → 8 Call
  your host (visitor calls the right employee). Don't invent steps such as
  host search or badge printing; ask for the flow if it isn't known.

## G. Station screen inside a tablet mockup (hero sections)
Dark hero sections show an `iPad Pro 11 Inches` mockup instance (485×673) whose
screen is 435×624 (`Screen Mask`, radius ~9.5). Screens are built as **editable
layers in a frame on top of the instance, inside the same group**, not as an
image in "Screen (replace here)". Put new screens in the standalone mockup
next to the section unless the user says to edit the section itself.
- Station UI language: the blurred dark leaf photo from the welcome screen
  (copy the `IMAGE` fill hash from that screen's "Screen (replace here)"), a dark
  vertical shade, an optional soft green glow, Manrope, a glass back button
  plus the cloned "English" language pill in the top bar.
- Hierarchy: one bright white primary action card (green gradient icon tile,
  dark chevron) and frosted-glass secondary cards (white 9% fill, 1px white 14%
  stroke, background blur 30). A progress bar with "STEP 1 OF 4" above a
  left-aligned 30px Bold heading.
- The section fades the tablet's bottom to black, so keep key content in the
  top ~65% of the screen and add a `Gradient fade (bottom)` layer (black 0 →
  95%, bottom ~230px) so the preview matches.
- Example: "Screen design / Visitor sign-in" (How would you like to sign in? →
  Sign in at the station / I'm pre-registered · FASTEST / Need help? Call reception).

### Wizard step screens (how the steps are layered)
Each `step N` frame layers, bottom to top: device group (iPad instance) →
`Screen / Step N` (editable screen design on the device screen) → black
vertical gradient (`Rectangle 2857`; designers tune its start per step) →
`Highlight / step N` (a **clone of the selected element**, same position, placed
above the gradient so it stays bright) → `Wizard / step N focus ring` (2px
green, 6px outside the element) → `Wizard / step N` tooltip.
- Make the selected element a solid white surface (or a solid dark camera view)
  so its copy looks identical above the gradient. Frosted glass would pick up
  the gradient behind it.
- Tooltip goes to the right of the element (Pointer=Left), 12px from the ring,
  vertically centered on it, clamped inside the frame.
- Screen language: blurred leaf photo + shade + green glow, back button,
  cloned "English" pill, 7-segment green progress bar, 26px Bold heading, 14px
  sub, 387-wide content column, 18–22 radius surfaces, green primary pill
  buttons. One selected element per screen.
- Designers edit these frames by hand too. Read the current layers before a
  rebuild, and never clear a group you didn't create in this run.
- **Two screen styles in one flow.** Use the station look (leaf photo, glass)
  only for the attract and choice screens (steps 1–3). Once the visitor starts
  entering data (step 4 on), switch to a calm, light, professional app style:
  page `#F4F5F7`, white app bar (back button, "Visitor sign-in", English pill)
  with a hairline bottom border, a 7-segment green progress bar plus "Step x of
  7", a 24px Bold dark heading with a 14px `#6B6E72` sub, white cards (1px
  `#E6E8EB` stroke, radius 12–16, soft shadow), real input fields (label above,
  `#F7F8F9` box, focused field with a 1.5px green border and cursor) and green
  primary buttons with a 12px radius. No decorative backgrounds there. Rebuild
  the UI as editable layers; never paste app screenshots onto the station
  background.
- **Data-entry top bar (designer-approved on step 4, used on steps 4–8):** one
  white bar (62px, hairline bottom border) holding the back button, the step
  title (Manrope Bold ~16) with its description under it (Medium 12, 62%
  black), and the screen's **single CTA, a green "Next" pill, on the right**.
  No separate page heading, no progress bar, no bottom buttons. Content cards
  start 16px below the bar at 18px side margins (399 wide). The last step
  (calling the host) has no Next; the Call button in the selected row is the
  action. Clone the bar from step 4 and edit its text rather than redrawing it.
- **Use real app copy for documents.** The NDA on the "Review documents" step uses
  the exact text from the real VFD app (intro paragraph plus sections 1–8:
  Confidential Information, Confidentiality Obligations, Permitted Disclosure,
  Documents and Property, Security and Privacy, Duration, No Licence or Other
  Rights, Acceptance). Show it as a full page that runs off the bottom of the
  screen (Bold 11.5 headings, Medium 10.5 / 145% body). Don't use grey
  placeholder bars when real copy exists.

## H. Tablet feature cards (Core sign-in flow row)
Cards in this row put the same iPad mockup (330×458 at ~32,36 in the 393×455
panel, screen 296×425) behind a panel-colored fade (`#EDEFF1` 0→100%, panel
y 276–455). The focus element or a floating detail sits above the fade. No
green ring here, the lift is enough. Shipped examples:
- *Pre-registration & QR*: the dark station screen cloned from "Custom sign-in
  workflows", re-titled "Express sign-in", with a QR scanner (corner brackets,
  green scan line and glow). A white **visitor pass** floats over the fade
  ("Pre-registered" chip, name, time and site, host, QR code drawn as one
  SVG path).
- *Visitor screening*: light data-entry screen ("Screening questions" in the
  top bar, Next CTA) with Yes/No question cards. The "restricted areas →
  Requires security approval" card is lifted above the fade, and an "Approval
  requested" toast floats bottom-right.

## I. Isometric glowing layer stack (dark hero illustrations)
Used on "Security compliance / Audit-ready records" (Webflow-style "platform
stack", recolored to VFD green). Built fully as vectors: `Visual / Audit-ready
records stack` (700×640) on the right of the 1440×721 black hero.
- Projection: P(x,y,z) = (cx + (x−y)·0.866, cy + (x+y)·0.5 − z). The rounded-
  square outline (s=270, r=44) is sampled and projected. Side faces = the
  front arc at top z + the same arc reversed at bottom z, split at the front
  vertex into a left face and a right face. Layers t=50 thick, 34 apart, drawn
  bottom to top.
- Look: faces in dark-green vertical gradients (`#0F4A34→#03100B`), top face
  gradient `#145C41→#05160F`, 1.6px `#3EE0A4` top stroke with a green drop-
  shadow glow, an inner rim, a glowing bottom edge. Behind the stack, faint
  `#15B87A` circuit traces at ±30° with node dots, plus a blurred green halo.
- Labels are live text skewed onto the left face with
  `relativeTransform = [[0.866,0,x],[0.5,1,y]]` (Figma keeps the skew).
- Logo on top: a **lock** (designer's choice over the shield; a database version
  is kept as a hidden alternative). Lay it flat with `matrix(0.866 0.5 −0.866
  0.5 cx cy) scale(6.6) translate(−12 −12)`, with no extra rotation, so it lines
  up with the face edges like the Webflow logo. Add a dark copy 8px lower for
  depth, and give the glyph a green glow.
- Labels read bottom-up as a build: Visitor records (base) → Signed agreements →
  Audit exports (top, next to the shield = the outcome). The designer chose this order.
