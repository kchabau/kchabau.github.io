---
name: portfolio-site
description: Edit or extend this static portfolio site, including its page content, shared layout, routes, and local preview workflow.
metadata:
  short-description: Work on the portfolio site
---

# Portfolio site

This repository is a static HTML, CSS, and vanilla JavaScript site for GitHub Pages. There is no package manager or runtime build dependency.

## Where to make changes

- Edit route content in `content/<route>.html`; the seven route names are `about`, `projects`, `experience`, `skills`, `personal`, `contact`, and `settings`.
- Edit `content/background.json` for the prepared answers in the Ask about Kevin panel.
- Edit `scripts/build.py` for the shared page shell, navigation, route metadata, and generated controls.
- Edit `assets/css/main.css`, `assets/css/print.css`, and `assets/js/main.js` for shared styling, print behavior, and interactions.
- Treat root `index.html` and each route's `index.html` as generated output. Run `python3 scripts/build.py` after source or shared-layout changes; do not hand-edit generated pages.

## Preview

From the repository root, run:

```sh
python3 scripts/build.py
python3 -m http.server 8000
```

Open `http://localhost:8000/` in the browser. The root route shows About; other pages use paths such as `/projects/` and `/settings/`. Use a local HTTP server so root-relative assets and navigation resolve as they do on GitHub Pages.

## Validation

When the change calls for checking the generated site, use the repository checks documented in `README.md`: `python3 scripts/check.py`, `node --check assets/js/main.js`, and `git diff --check`. Rebuild after edits that affect generated pages.
