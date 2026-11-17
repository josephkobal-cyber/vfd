# AI agent demo – 5 s loop

Muted, looping preview for the floating "Ask our AI receptionist" card (variant C on the
**AI Agent button** page in Figma). A visitor types "Do you work with Microsoft Teams?",
taps send, and the AI answers. The camera zooms into the input, then eases back to the reply.

| File | Use |
|---|---|
| `vfd-agent-demo-5s.mp4` | Website (720×424, H.264, 5.0 s, no audio) |
| `vfd-agent-demo-5s@2x.mp4` | Retina / large placements (1440×848) |
| `vfd-agent-demo-5s.webm` | Optional VP9 source for browsers that prefer WebM |
| `vfd-agent-demo-5s-poster.jpg` | Poster frame (also placed in the Figma video slot) |

Webflow: use a Background Video or an HTML embed with
`<video autoplay muted loop playsinline poster="…poster.jpg"><source src="…mp4" type="video/mp4"></video>`.

Re-render: `cd source && node render.js video` (frames to `source/frames/`), then the ffmpeg
commands from the session (H.264 CRF 18, yuv420p, faststart).
