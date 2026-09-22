"""Build responsive WebP copies without changing source photography. Requires Pillow."""
import json
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
    im = ImageOps.exif_transpose(Image.open(source))
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGBA' if 'transparency' in im.info else 'RGB')
    # Keep the original composition; object-position controls contextual crops.
    widths = sorted(set(min(im.width, size) for size in (480, 960, 1600, 2400)))
    name = source.relative_to(root / 'public').with_suffix('').as_posix().replace('/', '-').replace(' ', '-').lower()
    variants = []
    for width in widths:
        resized = im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS)
        target = output / f'{name}-{width}.webp'
        resized.save(target, 'WEBP', quality=84, method=6)
        variants.append((width, '/assets/optimized/' + target.name))
    manifest[key] = {'src': variants[-1][1], 'srcSet': ', '.join(f'{url} {width}w' for width, url in variants), 'width': im.width, 'height': im.height}
    original_bytes += source.stat().st_size
    optimized_bytes += (root / 'public' / variants[-1][1].lstrip('/')).stat().st_size
(root / 'src/data/image-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'{len(manifest)} assets: originals {original_bytes / 1e6:.1f} MB; largest WebP variants {optimized_bytes / 1e6:.1f} MB ({100 * (1 - optimized_bytes / original_bytes):.1f}% smaller)')
