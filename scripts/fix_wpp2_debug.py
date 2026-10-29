from PIL import Image, ImageDraw, ImageFont
import subprocess

subprocess.run(["git", "-C", r"C:\Users\gui14\Projects\dgflow", "checkout", "public/assets/wpp-claude-2-pE5VEO4Z.webp"])

p = r"C:\Users\gui14\Projects\dgflow\public\assets\wpp-claude-2-pE5VEO4Z.webp"
im = Image.open(p).convert("RGBA")
d = ImageDraw.Draw(im)

# The bubble with the avatar on the left (at y~710) is the third bubble!
# Let's find where the avatar is:
# The avatar circle is at x=35..100, y=685..745.
# So the third bubble starts at x=130, y=635 and ends at y=735!
# Wait, why was "E hoje o DGFLOW" still showing?
# Look at the previous screenshot:
# The text "E hoje o DGFLOW..." was at y=640..730!
# Wait, the previous script drew at y=550!
# Let's cover from y=635 to y=735, x=130 to x=815!

bg_color = im.getpixel((200, 680))
print("Covering bubble from y=635 to 735 with color", bg_color)
d.rounded_rectangle([130, 636, 815, 735], radius=24, fill=bg_color)

font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 34)
d.text((160, 650), "E hoje o Tenno Flow, é tudo em um só lugar", fill=(240, 240, 240, 255), font=font)
d.text((160, 690), "cara foda de mais!", fill=(240, 240, 240, 255), font=font)

# Also paste rocket from somewhere or draw clean text
im.save(p, "WEBP", quality=95)
print("Finished!")
