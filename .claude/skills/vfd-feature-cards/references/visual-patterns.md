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
- Proposed sign-in tour: 1 Start sign-in → 2 Enter visitor details → 3 Choose
  who you're visiting → 4 Take a photo → 5 Sign documents → 6 Print badge →
  7 Host gets notified.
