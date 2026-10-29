from PIL import Image, ImageDraw, ImageFont
import os

assets_dir = r"C:\Users\gui14\Projects\dgflow\public\assets"

font_bold = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 26)
font_regular = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
font_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11)

# 1. FIX content-preview-C8lyu3ta.webp
p1 = os.path.join(assets_dir, "content-preview-C8lyu3ta.webp")
im1 = Image.open(p1).convert("RGBA")
d1 = ImageDraw.Draw(im1)

# Top Left: "Diego Brandão" -> "Tenno Studio"
d1.rectangle([92, 32, 320, 68], fill=(13, 13, 16, 255))
d1.text((95, 34), "Tenno Studio", fill=(255, 255, 255, 255), font=font_bold)

# Avatar 1 label: "Diego" -> "Tenno"
d1.rectangle([20, 205, 65, 225], fill=(13, 13, 16, 255))
d1.text((22, 207), "Tenno", fill=(239, 68, 68, 255), font=font_sm)

# Right phone screen: "Diego Brandão"
d1.rectangle([705, 715, 850, 745], fill=(18, 18, 22, 255))
d1.text((708, 718), "Tenno Studio", fill=(255, 255, 255, 255), font=ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 16))

im1.save(p1, "WEBP", quality=95)
print("1. content-preview updated!")

# 2. FIX whatsapp-preview-DDEhdpdZ.webp
p2 = os.path.join(assets_dir, "whatsapp-preview-DDEhdpdZ.webp")
im2 = Image.open(p2).convert("RGBA")
d2 = ImageDraw.Draw(im2)

# Left group Top membros: "3. Diego Brandão" -> "3. Rafael Silva"
d2.rectangle([335, 260, 480, 282], fill=(18, 18, 22, 255))
d2.text((338, 263), "3. Rafael Silva", fill=(200, 200, 200, 255), font=font_sm)

# Right top group Top membros: "4. Diego Brandão" -> "4. Marcos Paulo"
d2.rectangle([675, 288, 800, 308], fill=(18, 18, 22, 255))
d2.text((678, 289), "4. Marcos Paulo", fill=(200, 200, 200, 255), font=font_sm)

# Bottom right group: "Vida de Designer G1" -> "Comunidade Criativa G1"
d2.rectangle([715, 560, 870, 588], fill=(18, 18, 22, 255))
d2.text((715, 563), "Comunidade Criativa G1", fill=(240, 240, 240, 255), font=ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 15))

# Bottom right group: "5. Diego Brandão" -> "5. Bruno Alencar"
d2.rectangle([675, 880, 800, 902], fill=(18, 18, 22, 255))
d2.text((678, 882), "5. Bruno Alencar", fill=(200, 200, 200, 255), font=font_sm)

# Left column chats: "Vida de Designer G..." -> "Comunidade Criativa..."
d2.rectangle([58, 590, 200, 614], fill=(18, 18, 22, 255))
d2.text((58, 592), "Comunidade Criativa...", fill=(240, 240, 240, 255), font=font_sm)

im2.save(p2, "WEBP", quality=95)
print("2. whatsapp-preview updated!")

# 3. FIX wpp-claude-2-pE5VEO4Z.webp
p3 = os.path.join(assets_dir, "wpp-claude-2-pE5VEO4Z.webp")
im3 = Image.open(p3).convert("RGBA")
d3 = ImageDraw.Draw(im3)

# Chat bubble: "E hoje o DGFLOW, é tudo em um só lugar"
# Box: x=145..800, y=650..710
d3.rectangle([140, 645, 800, 715], fill=(38, 38, 42, 255))
wpp_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 36)
d3.text((160, 652), "E hoje o Tenno Flow, é tudo em um só lugar", fill=(240, 240, 240, 255), font=wpp_font)

# Cover the tiny story thumbnail inside the reply header if needed
# The reply thumbnail is at x=145..370, y=100..380
# Cover with clean dark rounded rect
d3.rectangle([145, 100, 375, 390], fill=(24, 24, 27, 255))
# Add subtle icon/text
d3.text((180, 230), "Tenno Flow", fill=(160, 160, 160, 255), font=ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 28))

im3.save(p3, "WEBP", quality=95)
print("3. wpp-claude-2 updated!")

# 4. FIX ig-comment-1-DtXDiXJm.webp
# Crop out the bottom dygo_real comment
p4 = os.path.join(assets_dir, "ig-comment-1-DtXDiXJm.webp")
im4 = Image.open(p4)
# Keep up to y=430 (which contains 4 verified positive comments and completely removes dygo_real)
w, h = im4.size
im4_cropped = im4.crop((0, 0, w, 430))
im4_cropped.save(p4, "WEBP", quality=95)
print("4. ig-comment-1 cropped and updated!")
