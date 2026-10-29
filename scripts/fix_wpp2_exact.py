from PIL import Image, ImageDraw, ImageFont
import subprocess

subprocess.run(["git", "-C", r"C:\Users\gui14\Projects\dgflow", "checkout", "public/assets/wpp-claude-2-pE5VEO4Z.webp"])

p = r"C:\Users\gui14\Projects\dgflow\public\assets\wpp-claude-2-pE5VEO4Z.webp"
im = Image.open(p).convert("RGBA")
d = ImageDraw.Draw(im)

# Lower bubble is y=637 to y=736, x=130 to x=815
bg_color = (38, 39, 46, 255)
d.rounded_rectangle([130, 637, 815, 736], radius=24, fill=bg_color)

font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 34)
d.text((160, 652), "E hoje o Tenno Flow, é tudo em um só lugar", fill=(240, 240, 240, 255), font=font)
d.text((160, 690), "cara foda de mais! 🚀", fill=(240, 240, 240, 255), font=font)

im.save(p, "WEBP", quality=95)
print("Updated wpp-claude-2 perfectly!")
