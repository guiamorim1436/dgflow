from PIL import Image, ImageDraw, ImageFont
import os

img_path = r"C:\Users\gui14\Projects\dgflow\public\assets\leads-preview-8OCAfRuv.png"
im = Image.open(img_path).convert("RGBA")
print("Image size:", im.size)

# The card "Diego" is in the first column "Novo Lead"
# Let's inspect pixel colors around x=50..150, y=250..300
card_bg = im.getpixel((60, 260))
print("Card background color at (60, 260):", card_bg)

# Let's draw a dark rectangle over "Diego" and write "Carlos" or "Lucas Silva"
# Box for "Diego": roughly x=50..120, y=260..290
draw = ImageDraw.Draw(im)
# Cover "Diego"
draw.rectangle([48, 262, 120, 290], fill=(24, 24, 27, 255)) # match card dark bg

# Try to use a clean sans-serif font
font = None
for f_path in ["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf"]:
    if os.path.exists(f_path):
        font = ImageFont.truetype(f_path, 15)
        break

if font:
    draw.text((49, 265), "Carlos M.", fill=(255, 255, 255, 255), font=font)

im.save(img_path)
print("Updated leads-preview-8OCAfRuv.png successfully!")
