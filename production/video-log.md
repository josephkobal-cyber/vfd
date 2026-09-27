# Video approval log

Model for all Higgsfield clips: **Seedance 2.5** (`seedance_2_5`, mode `omni_reference`, 1080p, no audio), start frame = `storyboard-frames/clean/scene-XX.png`.
Workflow: one scene at a time — generate, iterate, lock, then move on.

| Scene | Status | Approved job id | Duration | Start frame | Notes / iterations |
|---|---|---|---|---|---|
| 01 | ✅ LOCKED | `24c03c96-7c10-4a4f-a392-add2de5cfa7e` (v2) | 5s | clean/scene-01.png | FINAL = v2 (real-time brisk walk, energetic steadicam follow + slight tilt up). Superseded: v1 `efcf18c9` (too slow / slow-mo feel); model test Cinema Studio `096d751e` (1344×768) |
| 02 | ✅ LOCKED | `55a81e9c-7ea8-48ff-abcc-da170de3dd18` (v2b) | 5s | clean/scene-02.png | v1 `dceef3c9` ❌ too slow (felt slow-mo), unnatural eye rolling, not dynamic · v2a `bf10a1cc-e669-4dd3-bf11-dd4004057bc0` real-time brisk walk + lateral tracking dolly · v2b `55a81e9c-7ea8-48ff-abcc-da170de3dd18` brisk walk toward camera + push-in/follow pan |
| 03 | ✅ LOCKED | `811a5bd6-a44c-4886-b88a-f559e3439dd3` (v1) | 5s | clean/scene-03.png | v1 `811a5bd6-a44c-4886-b88a-f559e3439dd3` — real-time brisk walk, close steadicam follow, counter stays hidden |
| 04 | ✅ LOCKED | `fc28128b-07ca-4210-8fa9-3f61605874ea` (v2) | 8s | empty plate `eb01f3e6` → end clean/scene-04.png | v1 `f2c7f4f1` ❌ wanted her to enter the frame · v2 `fc28128b-07ca-4210-8fa9-3f61605874ea` — start = empty plate (Julia removed), end = storyboard frame; she enters from left, stops at station, smiles |
| 06 · 07 · 10 · 12 · 13 · 16 (shared station clip) | ✅ LOCKED | `7f4c0f84-f904-4d05-8d22-b7ae8b32ecee` (v1) | 10s | clean/scene-06.png | v1 `7f4c0f84-f904-4d05-8d22-b7ae8b32ecee` — locked-off tripod, device & black screen perfectly still (for UI overlay), only soft light drift / leaf shadows on wall |
| 06b | ✅ LOCKED | `38f85881-7527-4c21-9bf3-9c6c55067d52` (v1) | 5s | clean/scene-06b.png | v1 `38f85881-7527-4c21-9bf3-9c6c55067d52` — Julia says "Yes, with Dr. Jackson" (~2s mouth movement, nod), then listens; final lip-sync done by client in Synthesia |
| 08 | ✅ LOCKED | `844ee651-76e6-4e82-bd5b-c401bca80c4b` (v2) | 8s | start frame `fa707823` (couple close behind glass) | v1 `321a70b7` ❌ background must match the panoramic window of her close-ups · new start frame `204297bc-fabf-4dd5-bfa0-30d01d9d6bff` = scene-08 with panoramic window + garden + 2 blurred people outside (ref clean/scene-05.png) → frame v2 `fa707823-33e6-462b-ba86-37db4b7964f8` couple just behind the glass, left · v2 video `844ee651-76e6-4e82-bd5b-c401bca80c4b` — couple walks L→R blurred, slight camera arc, trees sway |
| 14 | ⏳ review | `f4f35ef3-cf34-4fe1-b551-c58fbf946a6e` (v4) | 5s | start `ec070922` (clean/scene-14.png) → END frame `918ecfed-86f4-461a-b4c2-536944e91545` (wide pulled-back empty-lobby plate, Julia alone) = camera pull-back + no reappearing people; 4 people, couple L→R, doctor R→L · v3 `3658d6c0` near-static (no pull-back) · v2 `bc6adb6c` ❌ people reappeared · v1 `dc34461d` ❌ walked backwards

## Extra assets (not Higgsfield)

| Asset | Status | Files | Notes |
|---|---|---|---|
| AI voice bubble — speaking loop | ⏳ review | **Synthesia: `ui-assets/out/ai-bubble-speaking.gif`** (transparent GIF, 400px, 20fps) · `ui-assets/out/ai-bubble-speaking-720.mov` (ProRes 4444 + alpha), `ai-bubble-speaking.webm` (VP9 + alpha, 1080), `ai-bubble-speaking-preview.mp4` | Exact artwork `ui-assets/ai-bubble-ref.webp`, 8s seamless loop, 30fps: spins, liquid swirl, voice-like pulse + glow. Rendered in code (`ui-assets/animate_bubble.py`), 0 credits |
| AI voice bubble — idle loop | ⏳ review | **Synthesia: `ai-bubble-idle.gif`** · `ai-bubble-idle-720.mov`, `ai-bubble-idle.webm`, `ai-bubble-idle-preview.mp4` | Same artwork, slow breathing + gentle swirl, no spin (for listening / thinking beats) |

## Receptionist — live video call (portrait 9:16, scene 13)

Line: "Hello Julia. How can I help you today?" — lip-sync added by the client in Synthesia.

| Step | Status | Job | Notes |
|---|---|---|---|
| Still A | ❌ not picked | `4f327da3-387c-4a13-a695-0b092ed21d19` | curly shoulder-length hair, sage scrub top, single-ear headset |
| Still B | ✅ picked | `e2bd5492-798c-4894-9321-74de51969a81` | low bun, cream top + oak-brown cardigan, headset |
| Still B2 (reframe) | ✅ approved | `b63f7ae1-5fbf-4063-87cf-1c3752e0df74` | B reframed: less headroom above her head |
| Video v1 | ✅ LOCKED | `f83b171e-c368-4837-b54b-39dd4aa612f1` | Seedance 2.5, 9:16, 1080p, 5s, start frame B2 `b63f7ae1`; locked-off webcam, speaks the line, then listens smiling |
