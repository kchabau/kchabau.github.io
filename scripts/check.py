"""Check generated routes, metadata, assets, and local link integrity."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

routes = ('about', 'projects', 'experience', 'skills', 'personal', 'contact', 'settings')
for route in routes:
    source = ROOT / route / 'index.html'
    doc = Document(source.read_text())
    assert sum(tag == 'h1' for tag, _ in doc.tags) == 1, source
    nav = [attrs for tag, attrs in doc.tags if tag == 'a' and attrs.get('class') == 'nav-item']
    assert [attrs['href'] for attrs in nav] == ['/' + page for page in routes]
    assert [attrs['href'] for attrs in nav if attrs.get('aria-current') == 'page'] == ['/' + route]
    for key, value in [('name', 'description'), ('property', 'og:title'), ('property', 'og:description')]:
        assert any(tag == 'meta' and attrs.get(key) == value and attrs.get('content') for tag, attrs in doc.tags)
    ids = [attrs['id'] for _, attrs in doc.tags if 'id' in attrs]
    assert len(ids) == len(set(ids)), f'Duplicate IDs: {source}'
    for tag, attrs in doc.tags:
        target = attrs.get('src') or attrs.get('href', '')
        if target.startswith('/'):
            path = ROOT / urlparse(target).path.lstrip('/')
            assert path.is_file() or (path / 'index.html').is_file(), f'Missing local asset/link: {target}'
            fragment = urlparse(target).fragment
            if fragment:
                target_doc = Document((path if path.is_file() else path / 'index.html').read_text())
                assert any(attrs.get('id') == fragment for _, attrs in target_doc.tags), f'Missing section: {target}'
    print(f'PASS {route}: headings, navigation, metadata, local assets and links')
assert (ROOT / 'index.html').read_text() == (ROOT / 'about/index.html').read_text()
projects = Document((ROOT / 'projects/index.html').read_text())
assert sum(tag == 'details' for tag, _ in projects.tags) == 3
print('PASS landing page and three featured projects')
