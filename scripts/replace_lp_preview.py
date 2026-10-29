from PIL import Image

src_path = r"C:\Users\gui14\.gemini\antigravity\brain\98d9ea61-0bcf-4808-8a8f-e87cc19d132e\tenno_creative_landing_page_1793235605223.jpg"
dst_path = r"C:\Users\gui14\Projects\dgflow\public\assets\landing-page-preview-B0zFXjta.png"

im = Image.open(src_path)
im.save(dst_path, format="PNG", optimize=True)
print("Saved landing-page-preview-B0zFXjta.png with new Tenno Creative design!")
