import urllib.request
import re
import os
import json
from html.parser import HTMLParser

BASE_URL = "https://amppgujarat.org/"
PAGES = ["", "about.html", "leadership.html", "gallery.html", "event.html", "events.html", "contact.html", "student-chapter.html"]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

os.makedirs("c:/Users/HP/OneDrive/Desktop/GUJCORR/frontend/public/images/ampp", exist_ok=True)
scraped_data = {}

for page in PAGES:
    url = BASE_URL + page
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            scraped_data[page or 'index'] = html
            print(f"Fetched {url} ({len(html)} bytes)")

            # Extract image src
            imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
            for img in imgs:
                if not img.startswith('http'):
                    img_url = BASE_URL + img.lstrip('/')
                else:
                    img_url = img
                
                # Try downloading image
                filename = os.path.basename(img.split('?')[0])
                if filename and (filename.endswith('.png') or filename.endswith('.jpg') or filename.endswith('.jpeg') or filename.endswith('.svg') or filename.endswith('.webp')):
                    save_path = os.path.join("c:/Users/HP/OneDrive/Desktop/GUJCORR/frontend/public/images/ampp", filename)
                    if not os.path.exists(save_path):
                        try:
                            img_req = urllib.request.Request(img_url, headers=headers)
                            with urllib.request.urlopen(img_req, timeout=5) as img_resp:
                                with open(save_path, 'wb') as f:
                                    f.write(img_resp.read())
                                print(f"Saved image: {filename}")
                        except Exception as e:
                            pass
    except Exception as e:
        print(f"Error fetching {url}: {e}")

# Save scraped html to file for analysis
with open("c:/Users/HP/OneDrive/Desktop/GUJCORR/scraped_ampp.json", "w", encoding="utf-8") as f:
    json.dump({k: v[:50000] for k, v in scraped_data.items()}, f, indent=2)

print("Scraping completed!")
