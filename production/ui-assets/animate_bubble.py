"""Animate the VFD AI-assistant bubble (exact artwork from ai-bubble-ref.webp) as a
seamless transparent loop.

  python3 animate_bubble.py speaking   # voice-reactive pulse + spin
  python3 animate_bubble.py idle       # slow breathing, gentle swirl

Outputs (in ./out): <name>.mov (ProRes 4444 + alpha), <name>.webm (VP9 + alpha),
<name>-preview.mp4 (on the dark screen colour, for quick review).
"""
import os
import subprocess
import sys

import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "ai-bubble-ref.webp")
OUT = os.path.join(HERE, "out")
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

FPS = 30
LOOP_S = 8                # every motion uses whole cycles of this, so it loops seamlessly
SIZE = 1080               # output is SIZE x SIZE
CANVAS = 1600             # working canvas: room for the pulse to grow without clipping
R_SPHERE = 644            # sphere radius in the source image (glow extends ~70 px beyond)

PRESETS = {
    # spin: full turns per loop · swirl: liquid twist (rad) · pulse: max scale gain · glow: max glow boost
    "speaking": dict(spin=1, swirl=0.35, pulse=0.06, glow=0.6, voice=True),
    "idle": dict(spin=0, swirl=0.22, pulse=0.02, glow=0.25, voice=False),
}


def envelope(t, voice):
    """0..1 intensity. Voice = irregular syllable-like pulses; idle = slow breath."""
    w = 2 * np.pi * t / LOOP_S
    if not voice:
        return 0.5 + 0.5 * np.sin(2 * w - np.pi / 2)
    e = (0.45 * np.abs(np.sin(11 * w / 2))            # syllables
         * (0.55 + 0.45 * np.sin(3 * w + 1.0))         # phrases
         + 0.30 * np.abs(np.sin(17 * w / 2 + 0.7))
         + 0.25 * (0.5 + 0.5 * np.sin(5 * w + 2.0)))
    return float(np.clip(e / 0.85, 0, 1))


def main(name):
    p = PRESETS[name]
    src = np.asarray(Image.open(SRC).convert("RGBA")).astype(np.float32) / 255.0
    pad = (CANVAS - src.shape[0]) // 2
    src = np.pad(src, ((pad, CANVAS - src.shape[0] - pad), (pad, CANVAS - src.shape[1] - pad), (0, 0)))
    rgb = src[..., :3] * src[..., 3:]                  # premultiply so remap/resize don't fringe
    prem = np.dstack([rgb, src[..., 3]])

    c = CANVAS / 2.0
    yy, xx = np.mgrid[0:CANVAS, 0:CANVAS].astype(np.float32)
    dx, dy = xx - c, yy - c

    os.makedirs(OUT, exist_ok=True)
    n = FPS * LOOP_S
    mov = os.path.join(OUT, f"ai-bubble-{name}.mov")
    enc = subprocess.Popen(
        [FFMPEG, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgba",
         "-s", f"{SIZE}x{SIZE}", "-r", str(FPS), "-i", "-",
         "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le",
         "-vendor", "apl0", "-qscale:v", "9", mov],
        stdin=subprocess.PIPE)

    for i in range(n):
        t = i / FPS
        e = envelope(t, p["voice"])
        scale = 1.0 + p["pulse"] * e
        w = 2 * np.pi * t / LOOP_S

        # inverse mapping: output pixel -> source pixel
        sx, sy = dx / scale, dy / scale
        r = np.sqrt(sx * sx + sy * sy) / R_SPHERE
        phi = (p["spin"] * w
               + p["swirl"] * np.sin(2 * w - 3.0 * r) * np.clip(r, 0, 1)
               + 0.08 * p["swirl"] * np.sin(3 * w + 5.0 * r))
        cs, sn = np.cos(-phi), np.sin(-phi)
        mx = (c + cs * sx - sn * sy).astype(np.float32)
        my = (c + sn * sx + cs * sy).astype(np.float32)
        frame = cv2.remap(prem, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT)

        # glow: brighten the halo and the sphere a touch on voice peaks
        halo = np.clip((r - 0.97) / 0.03, 0, 1)[..., None]
        frame = frame * (1 + halo * p["glow"] * e)
        frame[..., :3] += (1 - halo) * 0.06 * e * frame[..., 3:]   # inner lift
        frame = np.clip(frame, 0, 1)

        frame = cv2.resize(frame, (SIZE, SIZE), interpolation=cv2.INTER_AREA)
        a = frame[..., 3:]
        rgb_out = np.where(a > 1e-4, frame[..., :3] / np.maximum(a, 1e-4), 0)
        out = np.dstack([np.clip(rgb_out, 0, 1), a])
        enc.stdin.write((out * 255 + 0.5).astype(np.uint8).tobytes())
        if i == n // 3:
            Image.fromarray((out * 255 + 0.5).astype(np.uint8)).save(os.path.join(OUT, f"ai-bubble-{name}-frame.png"))
    enc.stdin.close()
    enc.wait()

    webm = os.path.join(OUT, f"ai-bubble-{name}.webm")
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", mov, "-c:v", "libvpx-vp9",
                    "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "24", "-row-mt", "1", webm], check=True)
    preview = os.path.join(OUT, f"ai-bubble-{name}-preview.mp4")
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-f", "lavfi", "-i",
                    f"color=c=0x141414:s={SIZE}x{SIZE}:r={FPS}", "-i", mov,
                    "-filter_complex", "[0][1]overlay=shortest=1", "-c:v", "libx264",
                    "-pix_fmt", "yuv420p", "-crf", "18", preview], check=True)
    print(name, "done")


if __name__ == "__main__":
    for arg in sys.argv[1:] or ["speaking", "idle"]:
        main(arg)
