from PIL import Image
import subprocess

subprocess.run(["git", "-C", r"C:\Users\gui14\Projects\dgflow", "checkout", "public/assets/wpp-claude-2-pE5VEO4Z.webp"])

p = r"C:\Users\gui14\Projects\dgflow\public\assets\wpp-claude-2-pE5VEO4Z.webp"
im = Image.open(p)
w, h = im.size

# Search for the avatar at the bottom left:
for y in range(500, h):
    # Check pixels around x=65 (center of avatar)
    r, g, b = im.getpixel((65, y))[:3]
    # Check text around x=200 for brightness
    text_pixels = sum(1 for x in range(160, 400) if im.getpixel((x, y))[0] > 200)
    if text_pixels > 20:
        print(f"Text line found at y={y} (count={text_pixels})")
