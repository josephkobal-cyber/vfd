# Higgsfield log

Project: **VFD AI Receptionist Explainer** — project/folder id `662ee2f5-1a7d-4e27-a0da-58324dbc1e03`

## Reference elements
| Element | id | Source images |
|---|---|---|
| Uploaded media | 3/4 render hi-res `6442d77e-2bfb-4d2e-b91d-9cccc88359a7`, front UI render hi-res `ab85687f-d561-43b8-8bf3-b0a8261af6de`, dimensions `0832fee2-365e-48b4-bcc7-a26fb89a772a`, front screen-off `17598705-cea3-47ea-bb57-d82dc2e309e9`, back `347a1323-08f4-465f-901e-fc4cabedd532`, 3/4 shadow `eb2fb8b2-a330-45f4-a0dd-0d766b1de5ea` | |
| 3/4 master reference (use for all 3/4 shots) | `references/neat_studio_frame_key_call.jpg` → media `8018012e-fd11-4307-9f2d-b9db2fb62ae0` | also the logo placement/orientation reference |
| Julia media | full body `b75cca24-31c6-4a2d-b82c-03594f029f45` (`references/julia-full-body.webp`), avatar close-up `844b7a30-38e8-46ff-b2fe-c0327899a80a` | outfit: butter-yellow knit polo over blue/white striped shirt, brown belt gold buckle, light wide-leg jeans, white leather sneakers |
| Scale refs | `references/scale-ref-counter-wide.jpg` → `7dd25404-71eb-4c2a-abf0-9c4b4454073a`, `references/scale-ref-touch-closeup.jpg` → `cbed0cee-9e1f-47ad-9c71-4e551b142f1f` | device is large vs. person: top at ~chin/shoulder height, screen taller than head+neck; raised counter section |
| Dimensions hi-res | `references/station-dimensions-hires.png` → `1f8ef61b-1888-4c48-94d2-c1e6f30493f0` | 44.5 × 22.2 × 11.1 cm, 8° recline → vs. a 168 cm person: ~2 head-heights tall, ~1.5 head-widths wide, top at shoulder/collarbone on a ~105 cm counter |
| Neat-Frame (prop) | `4abbc040-b69a-4f88-afdc-41aae0a058b8` | front screen-off, 3/4 screen-off ×2, 3/4 screen-on, back (from `references/`) |

**Model choice:** `nano_banana_2` (2K = 2 credits/image). Pass references directly via `medias` (role `image_references`) rather than the element.

Note: element generations only injected the element's first image (front view) — for other angles, pass the matching reference directly.

## Generations
| Date | Job | Model | What | Verdict |
|---|---|---|---|---|
| 2026-09-26 | a3f81431 | gpt_image_2_5 | A1 reception wide (text only) | ✅ look approved · ❌ station |
| 2026-09-26 | 3a79c733 | gpt_image_2_5 | A2 station close-up (text only) | ❌ station inaccurate |
| 2026-09-26 | 24225d06 | gpt_image_2_5 | A3 waiting area | ✅ look approved |
| 2026-09-26 | b02cff8d | gpt_image_2_5 | B1 medical alternative | not chosen |
| 2026-09-26 | f4cd0c91 | nano_banana_2 | Station test 1 — front close-up, Neat-Frame element | ✅ best · ❌ neat. logo reads bottom→top (must read top→bottom) |
| 2026-09-26 | 50dc2291 | gpt_image_2 (high) | Station test 2 — front close-up, element | ❌ |
| 2026-09-26 | 041687dd | seedream_v4_5 | Station test 3 — front close-up, element | ❌ |
| 2026-09-26 | 4ecbc599 | nano_banana_2 | Station test 4 — 3/4 view on counter, element | ✅ good · ❌ side-view details wrong |
| 2026-09-26 | 1cf74196, 2e85a6d4 | nano_banana_2 2K | Round 2 — front close-up, direct refs: front UI render hi-res + front screen-off + 3/4 render hi-res; logo orientation in prompt | pending review |
| 2026-09-26 | 3f74a008, 83de59bc | nano_banana_2 2K | Round 2 — 3/4 view, direct refs: 3/4 render hi-res + dimension drawing (side profile) + back + 3/4 shadow | pending review |
| 2026-09-26 | b6b0f3ef, c44f4b9e | nano_banana_2 2K | Round 3 — 3/4 view, refs: neat_studio_frame_key_call (primary) + 3/4 render hi-res; logo top→bottom | ✅ approved station replica |
| 2026-09-26 | 683629fb | nano_banana_2 2K | Julia J1 — from behind walking through lobby (1B) | pending review |
| 2026-09-26 | 9c016559 | nano_banana_2 2K | Julia J2 — side view at counter with station (3A) | ❌ device too small |
| 2026-09-26 | a914ec19 | nano_banana_2 2K | Julia J3 — reverse angle behind station (4B/4D/5B) | ❌ device too small |
| 2026-09-26 | 2284fc0a | nano_banana_2 2K | Julia J2 v2 — side view, scale refs added | ❌ device too big |
| 2026-09-26 | 019b9db2 | nano_banana_2 2K | Julia J3 v2 — reverse angle, scale ref added | ✅ face matches avatar; raised counter section approved |
| 2026-09-26 | e1ecd80f, 8d6aa2fc | nano_banana_2 2K | Julia J2 v3 — side view, exact dimensions as body proportions | ❌ screen visible (rule: side views must hide the screen) |
| 2026-09-26 | 5ec56484, 9e257995 | nano_banana_2 2K | Julia J2 v4 — pure side profile, screen hidden; composition ref `station-side-counter-sound-rings` (`71db3503-c0d0-46a2-b552-7987152e52e4`) | pending review |
| 2026-09-26 | 096d751e | cinematic_studio_video_v2 pro, 5s | VIDEO TEST scene 01 — output 1344×768 | pending review |
| 2026-09-26 | efcf18c9 | seedance_2_5 omni_reference 1080p, 5s | VIDEO TEST scene 01 — output 1920×1080 | pending review |
| 2026-09-29 | dc0c98da, b343ca79 | nano_banana_2 2K | Station full side profile (90°), refs: dimensions 1f8ef61b + replica b6b0f3ef (+ side-counter 71db3503 for A). A = on clinic counter, B = studio | pending review |
| 2026-09-29 | 74658b38 | nano_banana_2 2K | Side profile B2 — edit of B (b343ca79): fabric only on bottom-front speaker, lower back/side = black plastic (ref back view 347a1323) | pending review · B picked over A |
| 2026-10-08 | fefbdbb9, 7d7f97ba | nano_banana_2 2K | Remote receptionist at laptop, camera behind laptop; ref = receptionist B2 b63f7ae1. A = laptop only, B = + second monitor with clinic lobby feed (ref d1fdb67f) | pending review |
