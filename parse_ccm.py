import re

with open("c:/Users/HP/OneDrive/Desktop/GUJCORR/CCM-2026.html", "r", encoding="utf-8") as f:
    ccm_html = f.read()

print("================ CCM-2026 HTML ================")
all_h = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', ccm_html, re.DOTALL)
for h in all_h:
    clean = " ".join(re.sub(r'<[^>]+>', '', h).split()).strip()
    if clean:
        print("  [H]", clean)

paras = re.findall(r'<p[^>]*>(.*?)</p>', ccm_html, re.DOTALL)
for p in paras:
    clean = " ".join(re.sub(r'<[^>]+>', '', p).split()).strip()
    if len(clean) > 40 and not clean.startswith('AMPP: The Association'):
        print("\n->", clean)
