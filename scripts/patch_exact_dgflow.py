from PIL import Image, ImageDraw, ImageFont

p = r"C:\Users\gui14\Projects\dgflow\public\assets\wpp-claude-2-pE5VEO4Z.webp"
im = Image.open(p).convert("RGBA")
d = ImageDraw.Draw(im)

# Sample background color in the 3rd bubble at (200, 668)
bg = im.getpixel((200, 668))

# Box covering "DGFLOW": x=280 to 425, y=655 to 680
d.rectangle([280, 655, 425, 680], fill=bg)

# Draw "Tenno Flow"
font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 26)
d.text((282, 654), "Tenno Flow", fill=(245, 245, 245, 255), font=font)

im.save(p, "WEBP", quality=95)
print("Replaced DGFLOW in wpp-claude-2!")
