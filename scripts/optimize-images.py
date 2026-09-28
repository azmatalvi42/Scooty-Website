"""Build responsive WebP copies without changing source photography. Requires Pillow."""
import json
import re
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
output = root / 'public/assets/optimized'
output.mkdir(exist_ok=True)
manifest = {}
original_bytes = optimized_bytes = 0
for source in sorted((root / 'public').rglob('*')):
    if source.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp'} or output in source.parents:
        continue
    key = '/' + source.relative_to(root / 'public').as_posix()
    im = Image.open(source)
    # Resizing would keep only the first frame, so animations are served as-is. (Camera JPEGs can
    # report is_animated too, for their embedded previews; those are still photos.)
    if getattr(im, 'is_animated', False) and im.format in ('GIF', 'WEBP', 'PNG'):
        continue
    im = ImageOps.exif_transpose(im)
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGBA' if 'transparency' in im.info else 'RGB')
    # Keep the original composition; object-position controls contextual crops.
    # 240 serves logos and icons; 1920 is the largest any layout needs (a full-bleed hero on a laptop
    # screen at 2x picks it), so nothing bigger is shipped.
    widths = sorted(set(min(im.width, size) for size in (240, 480, 960, 1440, 1920)))
    name = source.relative_to(root / 'public').with_suffix('').as_posix().replace('/', '-').replace(' ', '-').lower()
    variants = []
    for width in widths:
        resized = im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS)
        target = output / f'{name}-{width}.webp'
        resized.save(target, 'WEBP', quality=80, method=6)
        variants.append((width, '/assets/optimized/' + target.name))
    manifest[key] = {'src': variants[-1][1], 'srcSet': ', '.join(f'{url} {width}w' for width, url in variants), 'width': im.width, 'height': im.height}
    original_bytes += source.stat().st_size
    optimized_bytes += (root / 'public' / variants[-1][1].lstrip('/')).stat().st_size
(root / 'src/data/image-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
# Remove size variants this run no longer produces (old widths, renamed or deleted sources). Only
# `<name>-<width>.webp` files are touched; hand-made files like the navbar logos are left alone.
produced = {Path(url).name for entry in manifest.values() for url in (part.split(' ')[0] for part in entry['srcSet'].split(', '))}
removed = 0
for stale in output.glob('*.webp'):
    if re.search(r'-\d+\.webp$', stale.name) and stale.name not in produced:
        stale.unlink()
        removed += 1
if removed:
    print(f'removed {removed} stale variants')
print(f'{len(manifest)} assets: originals {original_bytes / 1e6:.1f} MB; largest WebP variants {optimized_bytes / 1e6:.1f} MB ({100 * (1 - optimized_bytes / original_bytes):.1f}% smaller)')
