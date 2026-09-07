"""Generate static routes from shared layout and editable document fragments."""
from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parent.parent
PAGES = {
    'about': ('About', '◎', 'Kevin Chabau is a Analytics Engineer focused on reliable, accessible, and useful data systems.'),
    'projects': ('Projects', '⌘', 'Engineering case studies in ETL, database design, and analytics by Kevin Chabau.'),
    'experience': ('Experience', '▤', 'Kevin Chabau’s background in operations, supply chain management, and Analytics engineering.'),
    'skills': ('Skills', '⌁', 'Kevin Chabau’s technical toolkit for Analytics engineering, analytics, and database design.'),
    'personal': ('Personal Life', '✳', 'A few interests outside Analytics engineering: travel, art, photography, and music.'),
    'contact': ('Contact', '↗', 'Connect with Kevin Chabau about Analytics engineering, analytics platforms, and technical systems.'),
    'settings': ('Settings', '⚙', 'Workspace settings and keyboard shortcut documentation for Kevin Chabau’s portfolio.'),
}


def reading_controls(prefix):
    rows = []
    for key, label in [('smallText', 'Small text'), ('fullWidth', 'Full width')]:
        rows.append(f'<div class="reading-toggle"><span id="{prefix}-{key}-label">{label}</span><button type="button" class="theme-switch" role="switch" aria-checked="false" aria-labelledby="{prefix}-{key}-label" data-reading-toggle="{key}"><span aria-hidden="true"></span></button></div>')
    return '<div class="reading-controls">' + ''.join(rows) + '</div>'

def theme_picker(prefix):
    return f'''<label class="theme-picker-row" for="{prefix}-theme">Theme<select id="{prefix}-theme" data-theme-select><option value="light">Light</option><option value="dark">Dark</option><option value="warm">Warm</option><option value="forest">Forest</option><option value="slate">Slate</option></select></label>'''

def page_actions():
    headings = ''.join(f'<label class="menu-heading-row">Heading {level}<select data-heading-style="{level}"><option value="default">Default</option><option value="sans">Sans serif</option><option value="serif">Serif</option><option value="mono">Monospace</option></select></label>' for level in range(1, 5))
    return f'''<div class="page-actions" hidden>
        <button type="button" class="page-actions-toggle" aria-label="Page options" title="Page options" aria-expanded="false" aria-controls="page-options"><span aria-hidden="true">•••</span></button>
        <div class="page-options" id="page-options" role="dialog" aria-label="Page options" hidden>
          <div class="options-heading"><strong>Page options</strong><button type="button" class="options-close" aria-label="Close page options">×</button></div>
          <div class="options-section"><span class="options-label">Reading</span>{reading_controls('menu')}</div>
          <div class="options-section"><span class="options-label">Heading styles</span>{headings}</div>
          {theme_picker('menu')}
          <div class="reading-toggle"><span id="menu-theme-label">Dark mode</span><button type="button" class="theme-switch" role="switch" aria-checked="false" aria-labelledby="menu-theme-label" data-theme-toggle><span aria-hidden="true"></span></button></div>
          <button type="button" class="options-action" data-export-pdf><span aria-hidden="true">↓</span> Export page as PDF</button>
          <a class="options-action" href="/settings">All settings <span aria-hidden="true">↗</span></a>
        </div>
      </div>'''

def background_panel():
    answers = json.loads((ROOT / 'content' / 'background.json').read_text())
    data = json.dumps(answers, ensure_ascii=False).replace('<', '\\u003c')
    questions = ''.join(f'<button type="button" class="background-question" data-background-question="{index}">{escape(item["question"])}</button>' for index, item in enumerate(answers))
    return f'''<div class="background-widget" hidden>
  <button type="button" class="background-launcher" aria-expanded="false" aria-controls="background-panel" aria-label="Ask about Kevin"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 3V6a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 13h6"/></svg> Ask about Kevin</button>
  <section class="background-panel" id="background-panel" role="dialog" aria-label="Ask about Kevin" hidden>
    <div class="background-header"><div><strong>Ask about Kevin</strong><small>Prepared answers · No live AI</small></div><button type="button" class="background-close" aria-label="Close background panel">×</button></div>
    <div class="background-conversation" role="log" aria-label="Questions and answers" aria-live="polite" aria-relevant="additions"><p class="background-welcome">Hi, I’m Kevin. Pick a question below to learn about my background, interests, and how I work.</p></div>
    <div class="background-prompt">Choose a question</div>
    <div class="background-questions">{questions}</div>
    <div class="background-footer"><span>Answers from Kevin’s background.</span><button type="button" data-clear-background>Clear chat</button></div>
  </section>
</div>
<script type="application/json" id="background-answers">{data}</script>'''

def render(route):
    name, _, description = PAGES[route]
    title = 'Kevin Chabau — ' + ('Analytics Engineer' if route == 'about' else name)
    nav = '\n'.join(f'<a href="/{key}" class="nav-item" title="{value[0]}"'+(' aria-current="page"' if key == route else '')+f'><span class="nav-icon" aria-hidden="true">{value[1]}</span><span class="nav-text">{value[0]}</span></a>' for key, value in PAGES.items())
    content = (ROOT / 'content' / f'{route}.html').read_text().replace('{{READING_CONTROLS}}', reading_controls('settings'))
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{escape(description, quote=True)}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{escape(description, quote=True)}">
  <meta property="og:type" content="website">
  <link rel="canonical" href="https://kchabau.github.io/{route}">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/print.css" media="print">
  <script src="/assets/js/main.js" defer></script>
</head>
<body>
<a class="skip-link" href="#document">Skip to content</a>
<div class="app-shell">
  <aside class="sidebar" id="sidebar">
    <a class="brand" href="/about" aria-label="Kevin Chabau, About">
      <span class="brand-monogram" aria-hidden="true">kc.</span>
      <span class="brand-text"><strong>Kevin Chabau</strong><small>Analytics Engineer</small></span>
    </a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="workspace-nav" hidden>Menu <span aria-hidden="true">☰</span></button>
    <div class="navigation" id="workspace-nav">
      <div class="sidebar-label">WORKSPACE</div>
      <nav aria-label="Portfolio sections">{nav}</nav>
    </div>
    <div class="sidebar-bottom"><a href="https://github.com/kchabau">GitHub ↗</a><a href="https://www.linkedin.com/in/kevinchabau/">LinkedIn ↗</a></div>
  </aside>
  <div class="content-shell">
    <header class="page-header">
      <div class="page-toolbar">
        <button class="sidebar-toggle" aria-expanded="true" aria-controls="sidebar" aria-label="Collapse Sidebar" hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>
          <span class="sidebar-tooltip" aria-hidden="true">Collapse Sidebar</span>
        </button>
      <div class="breadcrumb"><span>Kevin’s workspace</span><span class="slash">/</span><span data-page-label>{name}</span></div>
      </div>
      {page_actions()}
    </header>
    <main id="document" class="page-shell" data-route="{route}">
{content}
      <footer class="document-footer"><span>Kevin Chabau <span aria-hidden="true">/</span> {name}</span><span>Built with intention.</span></footer>
    </main>
  </div>
</div>
{background_panel()}
<button type="button" class="back-to-top" data-back-to-top hidden><span aria-hidden="true">↑</span> Back to top</button>
<div class="sr-only" role="status" data-status></div>
</body>
</html>
'''

for route in PAGES:
    directory = ROOT / route
    directory.mkdir(exist_ok=True)
    (directory / 'index.html').write_text(render(route))
(ROOT / 'index.html').write_text(render('about'))
print(f'Generated root and {len(PAGES)} static document routes.')
