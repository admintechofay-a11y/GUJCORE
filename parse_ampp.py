import re
import json

with open("c:/Users/HP/OneDrive/Desktop/GUJCORR/scraped_ampp.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for page, html in data.items():
    print(f"\n================ PAGE: {page} ================")
    # Extract headings
    headings = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', html, re.DOTALL)
    for h in headings[:25]:
        clean_h = " ".join(re.sub(r'<[^>]+>', '', h).split()).strip()
        if clean_h:
            print("  [H]", clean_h)
            
    # Extract links
    links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\']', html)
    unique_links = list(set([l for l in links if not l.startswith('#') and not l.startswith('javascript') and not l.startswith('http')]))
    print("  Internal Links:", unique_links)

    # Extract all img tags
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
    print("  Images:", list(set(imgs)))

    # Extract paragraphs
    paras = re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL)
    print("  Sample text paragraphs:")
    for p in paras:
        clean_p = " ".join(re.sub(r'<[^>]+>', '', p).split()).strip()
        if len(clean_p) > 30 and not clean_p.startswith('AMPP: The Association'):
            print("    ->", clean_p[:150])
