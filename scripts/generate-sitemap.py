"""Generate sitemap-0.xml with hreflang alternates + lastmod from dist/ pages."""
import os
import datetime

SITE = 'https://racketmojo.com'
DIST = 'dist'
LOCALES = ['en', 'ar', 'es']

pages = {}
for root, dirs, files in os.walk(DIST):
    for f in files:
        if f == 'index.html':
            rel = os.path.relpath(os.path.join(root, f), DIST)
            path = '/' + rel.replace('index.html', '')
            if path != '/':  # skip root redirect
                full = os.path.join(root, f)
                mtime = os.path.getmtime(full)
                lastmod = datetime.datetime.utcfromtimestamp(mtime).strftime('%Y-%m-%d')
                pages[path] = lastmod

sorted_pages = sorted(pages)

xml = ['<?xml version="1.0" encoding="UTF-8"?>']
xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">')

for page in sorted_pages:
    parts = page.strip('/').split('/')
    xml.append('  <url>')
    xml.append(f'    <loc>{SITE}{page}</loc>')
    xml.append(f'    <lastmod>{pages[page]}</lastmod>')

    path_without_locale = '/'.join(parts[1:]) if len(parts) > 1 else ''
    for loc in LOCALES:
        alt = f'{SITE}/{loc}/{path_without_locale}/' if path_without_locale else f'{SITE}/{loc}/'
        xml.append(f'    <xhtml:link rel="alternate" hreflang="{loc}" href="{alt}"/>')

    xdefault = f'{SITE}/en/{path_without_locale}/' if path_without_locale else f'{SITE}/en/'
    xml.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{xdefault}"/>')
    xml.append('    <changefreq>weekly</changefreq>')
    xml.append('    <priority>0.8</priority>')
    xml.append('  </url>')

xml.append('</urlset>')

with open(f'{DIST}/sitemap-0.xml', 'w') as f:
    f.write('\n'.join(xml))

print(f'Sitemap: {len(sorted_pages)} pages with lastmod')
