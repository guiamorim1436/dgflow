from PIL import Image, ImageDraw, ImageFont

p = r"C:\Users\gui14\Projects\dgflow\public\assets\wpp-claude-2-pE5VEO4Z.webp"
im = Image.open(p).convert("RGBA")
d = ImageDraw.Draw(im)

# At y=655 to 680, x=290 to 455 is "DGFLOW"
# Let's inspect bg color in that bubble around (250, 668)
bg = im.getpixel((250, 668))
print("Background at (250, 668):", bg)

# Erase "DGFLOW"
d.rectangle([285, 656, 455, 678], fill=bg)

# Draw "Tenno Flow"
font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 25)
d.text((287, 653), "Tenno Flow", fill=(245, 245, 245, 255), font=font)

# Also check the story header at top:
# Cover the top story thumbnail (y=105 to 395, x=135 to 370)
# It has tiny text from Diego's story. Let's make it a clean sleek blurred/dark rect with Tenno Flow logo
d.rounded_rectangle([135, 105, 370, 395], radius=16, fill=(24, 24, 27, 255))
title_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 20)
d.text((155, 240), "Tenno Flow", fill=(200, 200, 200, 255), font=title_font)

im.save(p, "WEBP", quality=95)
print("Updated wpp-claude-2 successfully!")
