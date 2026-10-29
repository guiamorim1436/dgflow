from PIL import Image

p = r"C:\Users\gui14\Projects\dgflow\public\assets\wpp-claude-2-pE5VEO4Z.webp"
im = Image.open(p)

bright_x = [x for x in range(140, 800) if im.getpixel((x, 785))[0] > 180]
print("Bright pixels on y=785:", bright_x[:15], "...", bright_x[-15:])
