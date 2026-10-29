from PIL import Image
import subprocess

subprocess.run(["git", "-C", r"C:\Users\gui14\Projects\dgflow", "checkout", "public/assets/wpp-claude-2-pE5VEO4Z.webp"])

p = r"C:\Users\gui14\Projects\dgflow\public\assets\wpp-claude-2-pE5VEO4Z.webp"
im = Image.open(p)

for y in range(650, 750, 5):
    bright_x = [x for x in range(150, 800) if im.getpixel((x, y))[0] > 200]
    if bright_x:
        print(f"y={y}: min_x={min(bright_x)}, max_x={max(bright_x)}, count={len(bright_x)}")
