import os, glob

BASE_DIR = '/home/nate_foxtrot/PROJECTS/SOFTWARE/Website_Final'
SITEMAP_FILE = os.path.join(BASE_DIR, 'sitemap-0.xml')
BASE_URL = 'https://usstech.net'

# Discover all HTML pages in root and services/
root_pages = [os.path.basename(f) for f in glob.glob(os.path.join(BASE_DIR, '*.html'))]
service_pages = [os.path.join('services', os.path.basename(f)) for f in glob.glob(os.path.join(BASE_DIR, 'services', '*.html'))]

all_pages = sorted(root_pages + service_pages)

# Filter out private/internal or error pages
ignore = {'404.html', 'capture.html', 'dev-dashboard.html', 'success.html'}

urls = []
for p in all_pages:
    if p in ignore:
        continue
    if p == 'index.html':
        urls.append(BASE_URL)
    else:
        # Standard clean URL mapping
        clean_name = p.replace('.html', '')
        urls.append(f"{BASE_URL}/{clean_name}.html")

xml_entries = "".join([f"<url><loc>{u}</loc></url>" for u in urls])
sitemap_xml = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{xml_entries}</urlset>'

with open(SITEMAP_FILE, 'w') as f:
    f.write(sitemap_xml)

print(f"Updated sitemap with {len(urls)} live URLs.")
