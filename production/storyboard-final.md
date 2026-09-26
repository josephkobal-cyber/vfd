# Final storyboard v2 (from production/storyboard-frames)

Start frames for video: `production/storyboard-frames/clean/scene-XX.png` (cropped from the storyboard cards, 2724×1532, 16:9).

| Scene | Frame | Visual | Audio | Made in |
|---|---|---|---|---|
| 01 | clean/scene-01.png | Exterior, sunny: follow Julia from behind toward the Northgate Clinic entrance | Music | Higgsfield video (tracking) |
| 02 | clean/scene-02.png | Wide interior: Julia pushes the black-framed glass door open and steps in | Music / ambience | Higgsfield video |
| 03 | clean/scene-03.png | Follow Julia from behind through the arched hallway toward reception | Music | Higgsfield video (tracking) |
| 04 | clean/scene-04.png | Side view at counter, station edge-on (screen hidden) | AI: "Welcome to Northgate Clinic. I'm here to answer questions, help you check in, or connect you with reception at any time. How can I help you today?" | Higgsfield video + sound rings |
| 05 | clean/scene-05.png | Julia medium shot, panoramic window | Julia: "Hi. I just arrived and parked behind the building. Is that okay?" | Synthesia avatar on empty plate |
| 06 | clean/scene-06.png | Station close-up, blank screen | AI: "Yes. Those parking spaces are reserved for clinic patients. Do you have an appointment today?" | Station clip + screen UI overlay |
| 06b | clean/scene-06b.png | Side view, Julia speaks | Julia: "Yes, with Dr. Jackson." | Higgsfield video + lip-sync to Synthesia audio |
| 07 | clean/scene-07.png | Station close-up | AI: "Perfect. Let's get you checked in." | Station clip + UI |
| 08 | clean/scene-08.png | Julia taps the screen (device back to camera — no screen treatment needed) | AI: "Please enter your name on the screen, or scan the QR code to check in from your phone. Let me know when you're done." | Higgsfield video |
| 09 | clean/scene-09.png | Julia medium shot | Julia: "Okay, I'm done." | Synthesia |
| 10 | clean/scene-10.png | Station close-up | AI: "Great, thank you. You can take a seat. I'll let Dr. Jackson's team know you've arrived, and they'll come get you when they're ready." | Station clip + UI |
| 11 | clean/scene-11.png | Julia medium shot | Julia: "Actually, I have a question about my next appointment." | Synthesia |
| 12 | clean/scene-12.png | Station close-up | AI: "Of course. Let me connect you with reception." | Station clip + UI |
| 13 | clean/scene-13.png | Station close-up → live video call | Receptionist: "Hello Julia, how can I help you today?" | Station clip + Synthesia receptionist on screen |
| 14 | clean/scene-14.png | Wide from behind, Julia talking, doctor & patients pass; slow pull-back | Conversation under music | Higgsfield video |
| 15 | clean/scene-15.png | Julia close-up | Julia: "Oh — one more thing. Where's the restroom?" | Synthesia |
| 16 | clean/scene-06.png (reuse station clip) | Cut back to station — AI answers | AI: "Down the hall, second door on your left." | Station clip + UI |

Station close-ups 06/07/10/12/13 share ONE locked-off Higgsfield clip (subtle light drift only); screen content is overlaid in Synthesia.

## Decisions (2026-09-26)
- Scene 6b lip-sync: handled by the client in Synthesia (no audio provided for Higgsfield).
- Clip durations: estimated; client trims in Synthesia.
- Ending: after scene 15 the AI answers (scene 16, reusing the station clip). Final hero/end card handled by the client.
- Video model: test on scene 1 — Cinema Studio Video pro vs Seedance 2.5 (1080p).
