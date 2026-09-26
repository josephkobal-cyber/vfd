# Virtual Front Desk — AI Receptionist (90s) — Shot List v1

Status: **draft for approval**. Timings are estimates (~150 words/min) and get locked
once the Synthesia voice lines are recorded.

## Locked decisions

| Topic | Decision |
|---|---|
| Station | Neat Frame (VFD is an official Neat partner, branding allowed). 15.6" portrait touchscreen, 445 mm tall × 222 mm wide × 111 mm deep, screen reclined 8°. On a ~1 m counter its top sits around mid-chest of a standing adult. See `references/station-front-screen-off.jpg`, `references/station-dimensions.jpg` |
| Placement | On the reception counter: light oak cabinet, stone top, waist height |
| Visitor | "Julia Smith", Synthesia avatar (see `references/julia-synthesia-avatar.webp`) — pale-yellow polo sweater over striped collar shirt, brown belt, clear glasses, slicked-back blonde hair. Outfit never changes. |
| Receptionist | Synthesia avatar (to be picked) |
| Voices | All voice lines recorded in Synthesia (AI assistant, Julia, receptionist) |
| Final edit | Synthesia (overlays, VO, music, titles) |
| Clinic look | *Assumed, please confirm:* warm white walls, light oak, stone counter, plants, soft daylight through large windows — matches Julia's avatar lighting |
| AI-speaking motif | White concentric sound rings around the station whenever the AI speaks and the screen isn't visible |

## Method key

| Code | Meaning |
|---|---|
| **HF** | Higgsfield video, full scene, Julia generated from avatar reference |
| **HF-PLATE** | Higgsfield locked-off shot (still camera), station screen **blank black, straight-on to camera** → screen UI overlaid in Synthesia |
| **SYN-J** | Synthesia Julia avatar over a Higgsfield lobby background plate (station POV) |
| **SYN-R** | Synthesia receptionist avatar, shown inside the station screen |
| **MG** | Motion graphics (UI animation MP4, sized to the Neat Frame screen) |
| **RINGS** | Sound-ring overlay synced to AI voice |
| **LOGO FIX** | "neat." bezel logo readable → replace with real logo in post |

## Reusable plates (generate once, use many times)

| Plate | Used in |
|---|---|
| **P1 — Station close-up**, straight-on, locked-off, blank screen, counter + soft lobby behind. Framing reference: the front-facing Hiveworks product shot (station centered on counter, shallow depth of field) — restyled to the clinic look. Camera slightly above screen center, tilted down ~8° so it is perpendicular to the reclined glass → screen reads as a clean rectangle for the overlay | 2B, 4A, 5A, 6C, 7A |
| **P2 — Lobby background from station POV**, soft focus, subtle ambient movement | 2A, 4E, 6B, 7B (behind SYN-J) |
| **P3 — Wide over-shoulder**, Julia beside station, screen straight-on and unobstructed | 7C |
| **P4 — Hero**, station on counter, beautiful light | 8A, 8C background |

---

## Scene 1 — Arrival (~14s)

| # | Shot | Dur | Method | Screen / overlay | Audio |
|---|---|---|---|---|---|
| 1A | Wide: clinic entrance, Julia walks through the front door; reception area attractive but unattended | 4s | HF | — | Music in, ambience |
| 1B | Tracking from behind Julia as she approaches the counter; station visible ahead | 4s | HF | Soft generated welcome glow, no readable UI (moving camera) | AI: "Welcome to Northgate Clinic. I'm here to answer questions, |
| 1C | Medium side view (like `station-side-counter-sound-rings`): Julia stops at the counter | 6s | HF | RINGS | …help you check in, or connect you with reception at any time. How can I help you today?" |

## Scene 2 — Natural question (~10.5s)

| # | Shot | Dur | Method | Screen / overlay | Audio |
|---|---|---|---|---|---|
| 2A | Julia close-up, station POV (she looks into lens = at the screen) | 4.5s | SYN-J on P2 | — | Julia: "Hi. I just arrived and parked behind the building. Is that okay?" |
| 2B | Station close-up, reacts immediately | 6s | HF-PLATE (P1) + MG | Listening → answer: voice visualizer + card "Patient parking ✓" · LOGO FIX | AI: "Yes. Those parking spaces are reserved for clinic patients. Do you have an appointment today?" |

## Scene 3 — Appointment (~4.5s)

| # | Shot | Dur | Method | Screen / overlay | Audio |
|---|---|---|---|---|---|
| 3A | Side view, Julia standing at the counter | 4.5s | HF (lip-sync driven by Synthesia audio) | RINGS on AI line | Julia: "Yes, with Dr. Jackson." · AI: "Perfect. Let's get you checked in." |

⚠️ Only on-camera Julia line not covered by Synthesia. Profile angle + short line keeps risk low; fallback = angle from slightly behind.

## Scene 4 — Guided check-in (~10.5s)

| # | Shot | Dur | Method | Screen / overlay | Audio |
|---|---|---|---|---|---|
| 4A | Screen close-up, "Check In" option highlights | 3s | HF-PLATE (P1) + MG | Check-in UI, button pulse · LOGO FIX | AI: "Please enter your name on the screen, or scan the QR code |
| 4B | Over-shoulder macro: Julia's finger taps the screen | 2s | HF | Shallow focus, screen content soft/unreadable (finger over screen can't take an overlay) | …to check in from your phone. |
| 4C | **Option A:** name typed on screen | 2s | MG (full frame, no hand) | Keyboard, "Julia Smith" typing in, tap ripples | Let me know when you're done." |
| 4D | **Option B:** Julia raises her phone to the QR code | 2s | HF + MG | Phone and station softly focused → MG "✓" pop | (VO tail) |
| 4E | Julia close-up | 1.5s | SYN-J on P2 | — | Julia: "Okay, I'm done." |

## Scene 5 — VFD takes action (~9.5s)

| # | Shot | Dur | Method | Screen / overlay | Audio |
|---|---|---|---|---|---|
| 5A | Screen close-up | 4s | HF-PLATE (P1) + MG | "Julia Smith — Checked In ✓" → "Notifying Dr. Jackson's team…" · LOGO FIX | AI: "Great, thank you. You can take a seat. |
| 5B | Back office: staff desk, notification appears | 2.5s | HF (locked-off, blank monitor/phone) + MG | Notification: "Julia Smith has arrived — Dr. Jackson" | I'll let Dr. Jackson's team know you've arrived, |
| 5C | Julia smiles, walks toward the waiting area | 3s | HF | RINGS (subtle) | …and they'll come get you when they're ready." |

## Scene 6 — One more question (~9.5s)

| # | Shot | Dur | Method | Screen / overlay | Audio |
|---|---|---|---|---|---|
| 6A | Before sitting, Julia turns back and steps to the counter | 2s | HF | — | — |
| 6B | Julia close-up | 3.5s | SYN-J on P2 | — | Julia: "Actually, I have a question about my next appointment." |
| 6C | Station close-up: thinking beat → answer | 4s | HF-PLATE (P1) + MG | Thinking shimmer (1s) → "Connecting you with reception…" · LOGO FIX | AI: "Of course. Let me connect you with reception." |

## Scene 7 — Human handoff (~9s)

| # | Shot | Dur | Method | Screen / overlay | Audio |
|---|---|---|---|---|---|
| 7A | Screen close-up: AI interface transitions smoothly into live video call | 2.5s | HF-PLATE (P1) + MG + SYN-R | MG transition → receptionist in call UI · LOGO FIX | Receptionist: "Hi! How can I help you?" |
| 7B | Julia close-up, smiles | 1.5s | SYN-J on P2 | — | Julia: "Oh hi!" |
| 7C | Wide over-shoulder, Julia talking with the receptionist on screen | 5s | HF-PLATE (P3) + SYN-R, slow digital zoom-out in Synthesia (render P3 at 4K) | Receptionist video on screen | Conversation ducks under music swell |

## Final scene — Hero (~12.5s)

| # | Shot | Dur | Method | Screen / overlay | Audio |
|---|---|---|---|---|---|
| 8A | Clean hero shot of the station on the counter | 3s | HF-PLATE (P4) + MG | VFD welcome screen · LOGO FIX | Music |
| 8B | Quick montage: delivery person, employee, another patient each approach the station | 4.5s (3 × 1.5s) | HF | RINGS | Music |
| 8C | End card over soft P4 | 5s | MG | "Virtual Front Desk AI receptionist" / "AI when it can. Human when needed." (VFD logo added by client in Synthesia if needed) | Music out |

**Estimated total: ~80s** → the remaining ~10s is breathing room once the real VO timing is known.

---

## Generation checklist

**Higgsfield**
- [ ] Julia character reference (from avatar screenshot, same outfit)
- [ ] Clinic look style frame (approve before anything else)
- [ ] Plates P1–P4
- [ ] HF shots: 1A, 1B, 1C, 3A, 4B, 4D, 5B, 5C, 6A, 8B ×3

**Synthesia**
- [ ] All VO lines (AI, Julia, receptionist) — record first, export audio
- [ ] SYN-J clips: 2A, 4E, 6B, 7B
- [ ] SYN-R receptionist clip (7A, 7C)

**Motion graphics (MP4, 1080×1920 portrait — the Neat Frame screen is 9:16)**

UI style (from the front-facing product shot): full-bleed photo header with uppercase
white welcome headline, white pill buttons (e.g. "Call Receptionist"), white content panel
below, thin black footer bar, language pill top-right. Restyle for "Northgate Clinic".

- [ ] Listening/voice visualizer + parking answer card (2B)
- [ ] Check-in UI + button pulse (4A)
- [ ] Name typing (4C), QR ✓ (4D)
- [ ] Checked In → Notifying (5A), staff notification (5B)
- [ ] Thinking → Connecting (6C), AI → video-call transition (7A)
- [ ] Welcome screen (8A), end card (8C)
- [ ] Sound rings overlay (transparent)

## Still needed from you
- [x] Straight-on front photo of the station, screen off, plus dimensions
- [ ] Confirm the clinic look
- [ ] neat. logo SVG → `references/` (VFD logo not needed)
- [ ] UI screenshots of the real interface
- [ ] Receptionist avatar pick
