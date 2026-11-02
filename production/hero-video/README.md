# Hero video: visitor sign-in flow

A 24-second seamless loop of the iPad sign-in story for the "Control every visitor sign-in" hero.
Only the screen animates; the iPad frame stays still.

| File | Use |
|---|---|
| `vfd-sign-in-flow.mp4` | H.264, 1012×1388, 30 fps, iPad on black. Plays everywhere, matches the black hero. |
| `vfd-sign-in-flow-transparent.webm` | VP9 with alpha (transparent background) for layering on the site (Chrome, Firefox, Edge). |
| `vfd-sign-in-flow-poster.jpg` | First frame, used as the `poster` while the video loads. |

Embed: `<video src="vfd-sign-in-flow.mp4" poster="vfd-sign-in-flow-poster.jpg" autoplay muted loop playsinline></video>`

## Story (seconds)
0–2 welcome, tap **Visitor Sign in** · 2–4 visitor type, select **Visitor** · 4–6 select **Sign in at the station** ·
6–11 details typed (Emily Carter, Northwind Ltd, email, mobile) → Next · 11–16 NDA scrolls, "Sign the agreement",
signature draws → Next · 17–19 camera, shutter, flash, "Photo captured" → Next · 19–23 search "Sarah", tap **Call** on
Sarah Thompson → calling screen · 23–24 back to welcome.

## Re-render
Screens are rebuilt in `source/index.html` from the Figma "sign-in flow" component. Open it in a browser to preview the live loop
(`index.html?t=12.5` freezes a moment). To export: `node render.js frames` (Playwright, writes `frames/`), then encode:

    ffmpeg -f lavfi -i color=c=black:s=1012x1388:r=30 -framerate 30 -i frames/f%05d.png \
      -filter_complex "[0][1]overlay=shortest=1,format=yuv420p" -c:v libx264 -crf 18 -movflags +faststart vfd-sign-in-flow.mp4
    ffmpeg -framerate 30 -i frames/f%05d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 vfd-sign-in-flow-transparent.webm
