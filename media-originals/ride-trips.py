"""
Builds the home page's ride-trips loop from "Brampton Ride Arcs.gif": removes the city labels, grades
the arcs, makes the loop seamless and doubles the frame rate. Needs numpy, scipy and Pillow:

    python3 ride-trips.py <work-dir>     # writes <work-dir>/out.rgb (1280x720 rgb24, 25 fps) + poster.png

then encode with the ffmpeg commands in README.md.
"""
import sys, numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, binary_dilation
S = sys.argv[1]
gif = Image.open(__file__.rsplit('/', 1)[0] + '/Brampton Ride Arcs.gif')
frames = []
for i in range(gif.n_frames):
    gif.seek(i); frames.append(np.asarray(gif.convert('RGB'), np.float32))
fr = np.stack(frames)  # N,H,W,3
N = len(fr)

# 1. Static "BRAMPTON" map label: grey, unsaturated, bright in most frames.
y0, y1, x0, x1 = 552, 602, 710, 885
# The label never moves, so its per-pixel value is the darkest that pixel ever gets (arcs only add
# light on top). Subtract that, down to the near-black ground, inside a softly feathered box.
ground = np.array([12, 12, 15], np.float32)
label = np.maximum(fr[:, y0:y1, x0:x1].min(0) - ground, 0)
feather = np.zeros((y1 - y0, x1 - x0), np.float32); feather[4:-4, 4:-4] = 1
feather = gaussian_filter(feather, 2)[..., None]
fr[:, y0:y1, x0:x1] = np.maximum(fr[:, y0:y1, x0:x1] - label * feather, 0)
# The GIF's dithering leaves dim coloured speckle on the letter edges; inside the letter shapes,
# anything dimmer than an arc goes back to the ground colour.
letters = binary_dilation(label.mean(-1) > 12, iterations=2)
box = fr[:, y0:y1, x0:x1]
r, g, b = box[..., 0], box[..., 1], box[..., 2]
# Arcs are only orange, pink or purple, so green- or blue-dominant pixels there are dither noise too.
speckle = letters & ((box.max(-1) < 80) | (g > r) | (b > r * 1.4))
box[speckle] = ground

# 2. Crop away the city caption, suburb names and corner attribution (16:9).
fr = fr[:, 0:945, 200:1880]

# 3. Grade: dim the grey street map, lift the arcs and give them a soft glow.
out = []
for f in fr:
    s = (f.max(-1) - f.min(-1)) / 255.0
    arc = np.clip((s - .12) / .25, 0, 1)[..., None]
    base = f * .62
    lum = f.mean(-1, keepdims=True)
    vivid = np.clip(lum + (f - lum) * 1.35, 0, 255) * 1.12
    g = base * (1 - arc) + vivid * arc
    small = np.asarray(Image.fromarray(np.clip(vivid * arc, 0, 255).astype(np.uint8)).resize((420, 236), Image.BILINEAR), np.float32)
    bloom = np.stack([gaussian_filter(small[..., c], 3) for c in range(3)], -1)
    bloom = np.asarray(Image.fromarray(np.clip(bloom, 0, 255).astype(np.uint8)).resize((1680, 945), Image.BILINEAR), np.float32)
    g = 255 - (255 - g) * (255 - bloom * .55) / 255  # screen blend
    out.append(np.asarray(Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)).resize((1280, 720), Image.LANCZOS), np.float32))
out = np.stack(out)

# 4. Seamless loop: crossfade the last K frames into the first K.
K = 14
seq = list(out[K:N - K])
for i in range(K):
    a = (i + 1) / (K + 1)
    seq.append(out[N - K + i] * (1 - a) + out[i] * a)
# 5. Double the frame rate (12.5 -> 25 fps) with in-between blends.
smooth = []
for i in range(len(seq)):
    smooth.append(seq[i]); smooth.append((seq[i] + seq[(i + 1) % len(seq)]) / 2)
np.clip(np.stack(smooth), 0, 255).astype(np.uint8).tofile(f"{S}/out.rgb")
Image.fromarray(np.clip(seq[0], 0, 255).astype(np.uint8)).save(f"{S}/poster.png")
print(len(smooth), "frames")
