import re

with open("c:/Users/HP/OneDrive/Desktop/GUJCORR/chairmans-desk.html", "r", encoding="utf-8") as f:
    chair_html = f.read()

print("================ CHAIRMAN'S DESK ================")
paras = re.findall(r'<p[^>]*>(.*?)</p>', chair_html, re.DOTALL)
for p in paras:
    clean = " ".join(re.sub(r'<[^>]+>', '', p).split()).strip()
    if len(clean) > 40 and not clean.startswith('AMPP: The Association'):
        print("\n->", clean)

with open("c:/Users/HP/OneDrive/Desktop/GUJCORR/board-of-directors.html", "r", encoding="utf-8") as f:
    bod_html = f.read()

print("\n================ BOARD OF DIRECTORS ================")
cards = re.findall(r'<div[^>]*class=["\'][^"\']*team-box[^"\']*["\'][^>]*>(.*?)</div>\s*</div>', bod_html, re.DOTALL)
for c in cards:
    name = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', c, re.DOTALL)
    desig = re.findall(r'<span[^>]*class=["\'][^"\']*desig[^"\']*["\'][^>]*>(.*?)</span>', c, re.DOTALL)
    img = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', c)
    print(f"Name: {name}, Desig: {desig}, Img: {img}")

# Also search for any other names and designations
all_h = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', bod_html, re.DOTALL)
for h in all_h:
    clean = " ".join(re.sub(r'<[^>]+>', '', h).split()).strip()
    print("  [H]", clean)
