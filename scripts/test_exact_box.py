from PIL import Image, ImageDraw, ImageFont
import subprocess

subprocess.run(["git", "-C", r"C:\Users\gui14\Projects\dgflow", "checkout", "public/assets/wpp-claude-2-pE5VEO4Z.webp"])

p = r"C:\Users\gui14\Projects\dgflow\public\assets\wpp-claude-2-pE5VEO4Z.webp"
im = Image.open(p).convert("RGBA")
d = ImageDraw.Draw(im)

# 1. Clean story thumbnail
d.rounded_rectangle([150, 105, 365, 390], radius=16, fill=(28, 28, 32, 255))
story_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 22)
d.text((170, 235), "Tenno Flow", fill=(180, 180, 180, 255), font=story_font)

# 2. In the 3rd bubble:
bg = im.getpixel((200, 670))
print("3rd bubble bg:", bg)

# Cover from x=285 to x=465, y=658 to y=685
d.rectangle([285, 658, 465, 685], fill=bg)

# Draw "Tenno Flow,"
font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 26)
d.text((287, 657), "Tenno Flow,", fill=(245, 245, 245, 255), font=font)

im.save(p, "WEBP", quality=95)
print("Updated!")
