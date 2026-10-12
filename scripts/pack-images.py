"""Losslessly encode the local game artwork for single-page delivery."""
from pathlib import Path
from PIL import Image
from io import BytesIO
import base64, json, re

root = Path(__file__).resolve().parent.parent
assets = {}
for path in sorted((root / 'dist/assets').rglob('*')):
    if path.suffix not in ('.png', '.webp'):
        continue
    key = path.relative_to(root / 'dist').as_posix()
    with Image.open(path) as image:
        image.load()
        output = BytesIO()
        image.save(output, format='WEBP', lossless=True, method=6)
    assets[key] = 'data:image/webp;base64,' + base64.b64encode(output.getvalue()).decode('ascii')
room_names = re.findall(r'^\s+(\w+):\{name:', (root / 'dist/catalog.js').read_text(), re.M)
expected = {f'assets/rooms/{name}.webp' for name in room_names}
expected.update(f'assets/people/{part}-{i}.png' for part in ('heads', 'tops', 'bottoms') for i in range(16))
assert set(assets) == expected, f'Unexpected or missing artwork: {set(assets) ^ expected}'
target = root / 'src/image-pack.json'
target.write_text(json.dumps(assets, separators=(',', ':')), encoding='utf-8')
print(f'Packed {len(assets)} lossless images: {target.stat().st_size / 1048576:.2f} MB')
