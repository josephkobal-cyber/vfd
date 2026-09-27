"""Subtle 'alive' animation of the Synthesia window background plate
(references/synthesia-window-bg.webp): trees sway gently in the wind, sunlight through the
leaves breathes a little, the wildflowers at the bottom sway. Window bars stay perfectly still.
Seamless loop.

  python3 animate_window_bg.py
"""
import os
import subprocess

import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "references", "synthesia-window-bg.webp")
OUT = os.path.join(HERE, "out", "window-bg-loop.mp4")
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

FPS = 25
LOOP_S = 10          # all motion uses whole cycles of this -> seamless loop
W, H = 1920, 1080
BARS = [(336, 364), (1624, 1652)]   # window mullions, x-range in source pixels (2000 wide)

TREE_AMP = 5.0       # px (source scale) sway of the foliage
GRASS_AMP = 4.0      # px sway of the wildflower tips
LIGHT_AMP = 0.025    # +-2.5 % dappled-light breathing


def smooth_noise(h, w, scale, seed):
    rng = np.random.default_rng(seed)
    small = rng.standard_normal((max(2, h // scale), max(2, w // scale))).astype(np.float32)
    big = cv2.resize(small, (w, h), interpolation=cv2.INTER_CUBIC)
    return cv2.GaussianBlur(big, (0, 0), scale / 2) / (big.std() + 1e-6)


def main():
    src = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)
    h, w = src.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)

    # where things move: foliage (top ~65 %), lawn nearly still, wildflowers in the bottom band
    yn = yy / h
    tree_w = np.clip((0.70 - yn) / 0.25, 0, 1)
    grass_w = np.clip((yn - 0.88) / 0.08, 0, 1)
    bar_mask = np.ones((h, w), np.float32)
    for x0, x1 in BARS:
        bar_mask[:, x0 - 10:x1 + 10] = 0
    bar_mask = cv2.GaussianBlur(bar_mask, (0, 0), 6)
    bar_mask[:, [x for x0, x1 in BARS for x in range(x0 - 2, x1 + 2)]] = 0

    # fixed random fields, animated by periodic phases so the loop is seamless
    fields = [smooth_noise(h, w, 160, s) for s in range(6)]
    light_fields = [smooth_noise(h, w, 220, 10 + s) for s in range(2)]

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    enc = subprocess.Popen(
        [FFMPEG, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow",
         "-crf", "12", "-g", "25", "-bf", "0", "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT],
        stdin=subprocess.PIPE)

    scale = max(W / w, H / h)
    rw, rh = int(round(w * scale)), int(round(h * scale))
    ox, oy = (rw - W) // 2, (rh - H) // 2

    for i in range(FPS * LOOP_S):
        ph = 2 * np.pi * i / (FPS * LOOP_S)
        # gusts: a few overlapping slow waves (1, 2, 3 cycles per loop)
        gust = 0.6 + 0.4 * np.sin(ph * 1 + 0.5)
        dx = gust * (np.sin(ph * 2) * fields[0] + np.cos(ph * 3) * fields[1] * 0.6) + 0.5 * np.sin(ph * 1 + fields[2])
        dy = 0.5 * (np.sin(ph * 2 + 1.0) * fields[3] + np.cos(ph * 3) * fields[4] * 0.6)
        g = np.sin(ph * 3 + xx / 90.0 + fields[5]) * (0.6 + 0.4 * np.sin(ph * 2))

        mx = xx + (TREE_AMP * tree_w * dx + GRASS_AMP * grass_w * g) * bar_mask
        my = yy + (TREE_AMP * 0.5 * tree_w * dy) * bar_mask
        frame = cv2.remap(src, mx.astype(np.float32), my.astype(np.float32), cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)

        light = 1 + LIGHT_AMP * tree_w * bar_mask * (np.sin(ph * 2) * light_fields[0] + np.cos(ph * 1) * light_fields[1]) * 0.5
        frame = np.clip(frame * light[..., None], 0, 255)

        frame = cv2.resize(frame, (rw, rh), interpolation=cv2.INTER_AREA)[oy:oy + H, ox:ox + W]
        enc.stdin.write(frame.astype(np.uint8).tobytes())
    enc.stdin.close()
    enc.wait()
    print("wrote", OUT)


if __name__ == "__main__":
    main()
