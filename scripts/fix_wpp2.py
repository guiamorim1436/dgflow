from PIL import Image, ImageDraw, ImageFont

# Load the original image from git or restore it
import subprocess
subprocess.run(["git", "-C", r"C:\Users\gui14\Projects\dgflow", "checkout", "public/assets/wpp-claude-2-pE5VEO4Z.webp"])

p = r"C:\Users\gui14\Projects\dgflow\public\assets\wpp-claude-2-pE5VEO4Z.webp"
im = Image.open(p).convert("RGBA")
w, h = im.size
print("Size:", w, h)

# Lower bubble is at y=630..735, x=130..815
# Bubble color is (38, 41, 48)
d = ImageDraw.Draw(im)

# Let's inspect pixel color inside lower bubble
bg_color = im.getpixel((200, 680))
print("Lower bubble bg color:", bg_color)

# Cover the text in lower bubble:
d.rectangle([150, 645, 800, 725], fill=bg_color)

font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 36)
d.text((158, 650), "E hoje o Tenno Flow, é tudo em um só lugar", fill=(240, 240, 240, 255), font=font)
d.text((158, 690), "cara foda de mais! 🚀", fill=(240, 240, 240, 255), font=font)

im.save(p, "WEBP", quality=95)
print("Updated wpp-claude-2 successfully!")
