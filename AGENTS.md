# Repository guidance

- This is a static GitHub Pages portfolio built with HTML, CSS, and vanilla JavaScript; it has no package manager or runtime build dependency.
- Make page-content changes in `content/<route>.html` and background-panel answer changes in `content/background.json`.
- The shared shell, route metadata, navigation, and generated controls live in `scripts/build.py`. Shared styles and interactions live in `assets/css/` and `assets/js/main.js`.
- `index.html` and each route directory's `index.html` are generated output. After changing source content or the shared layout, run `python3 scripts/build.py`; do not edit generated pages by hand.
- For a local preview, run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000/`. The root displays About; routes are available at paths such as `/projects/`.
- Use the validation commands in `README.md` when checks are requested or relevant to the change.
- The repo-local Codex skill is in `.codex/skills/portfolio-site/SKILL.md`.
