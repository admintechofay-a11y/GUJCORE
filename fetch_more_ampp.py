import urllib.request
import re
import os

PAGES = ["board-of-directors.html", "chairmans-desk.html", "CCM-2026.html", "service.html"]
BASE_URL = "https://amppgujarat.org/"
headers = {'User-Agent': 'Mozilla/5.0'}

os.makedirs("c:/Users/HP/OneDrive/Desktop/GUJCORR/frontend/public/images/ampp", exist_ok=True)

for page in PAGES:
    url = BASE_URL + page
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"\n================ FETCHED: {page} ({len(html)} bytes) ================")
            
            # Save html
            with open(f"c:/Users/HP/OneDrive/Desktop/GUJCORR/{page}", "w", encoding="utf-8") as f:
                f.write(html)
                
            # Download images
            imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
            for img in set(imgs):
                img_url = BASE_URL + img.lstrip('/') if not img.startswith('http') else img
                filename = os.path.basename(img.split('?')[0])
                if filename:
                    save_path = os.path.join("c:/Users/HP/OneDrive/Desktop/GUJCORR/frontend/public/images/ampp", filename)
                    if not os.path.exists(save_path):
                        try:
                            ireq = urllib.request.Request(img_url, headers=headers)
                            with urllib.request.urlopen(ireq, timeout=5) as iresp:
                                with open(save_path, 'wb') as f:
                                    f.write(iresp.read())
                                print(f"  [SAVED IMAGE] {filename}")
                        except Exception as e:
                            print(f"  [IMG ERROR] {filename}: {e}")
    except Exception as e:
        print(f"Error fetching {url}: {e}")
