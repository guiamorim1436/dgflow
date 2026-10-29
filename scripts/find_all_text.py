from PIL import Image

p = r"C:\Users\gui14\Projects\dgflow\public\assets\wpp-claude-2-pE5VEO4Z.webp"
im = Image.open(p)
w, h = im.size

prev_has_text = False
text_ranges = []
start_y = None

for y in range(h):
    # Check if this row has light text pixels
    bright = sum(1 for x in range(140, 800) if im.getpixel((x, y))[0] > 180 and im.getpixel((x, y))[1] > 180)
    has_text = bright > 15
    if has_text and not prev_has_text:
        start_y = y
    elif not has_text and prev_has_text:
        text_ranges.append((start_y, y))
    prev_has_text = has_text

for s, e in text_ranges:
    print(f"Text row: y={s}..{e}")
