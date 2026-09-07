# Kevin Chabau — portfolio

A static, document-style portfolio for GitHub Pages. It uses HTML, CSS, and vanilla JavaScript with no runtime dependencies.

## Edit and preview

Edit the source fragments in `content/`, then regenerate the committed production pages:

```sh
python3 scripts/build.py
python3 -m http.server 8000
```

Open `http://localhost:8000`. GitHub Pages serves the committed HTML files directly; it does not run `scripts/build.py`, so run the generator and commit its output whenever content or the shared layout changes. JavaScript progressively enhances the static pages with client-side navigation, history, focus management, a mobile menu, and clipboard support. The pages and navigation remain usable without JavaScript.

## Routes and source files

The production routes are `/about`, `/projects`, `/experience`, `/skills`, `/personal`, `/contact`, and `/settings`. The root URL `/` opens About. Edit the matching source fragment:

| Route | Source |
| --- | --- |
| `/about` | `content/about.html` |
| `/projects` | `content/projects.html` |
| `/experience` | `content/experience.html` |
| `/skills` | `content/skills.html` |
| `/personal` | `content/personal.html` |
| `/contact` | `content/contact.html` |
| `/settings` | `content/settings.html` |

`index.html` and each route’s `index.html` are generated output. Do not edit those files by hand. The shared shell, navigation, route metadata, page-options menu, and background panel are defined in `scripts/build.py`.

## Site controls

The top-right three-dot menu is available on every page. It contains Small text, Full width, H1–H4 heading styles, color themes, Export page as PDF, and a link to Settings. Settings exposes the same preferences in a full page view. Preferences are applied immediately across routes and saved in browser local storage when available.

Available color themes are Light, Dark, Warm, Forest, and Slate. Defaults are 15px body text, 1.4× line spacing, and a 790px document width. Small text changes body text to 14px. Full width removes the document-width limit. Reset appearance restores the light theme, default heading styles, and reading defaults.

Keyboard shortcuts:

- **Cmd+B** (Mac) / **Ctrl+B** (Windows/Linux): collapse or expand the desktop sidebar.
- **Shift+Cmd+L** (Mac) / **Shift+Ctrl+L** (Windows/Linux): toggle light and dark mode.
- **Cmd+J** (Mac) / **Ctrl+J** (Windows/Linux): open or close the prepared Ask about Kevin panel.
- **Esc**: close an open menu or panel.

## Background panel

The bottom-right **Ask about Kevin** button opens a chat-style panel with ten prepared questions and answers. It is a static experience with no AI service and no free-text input. Each answer may link to a relevant page or experience section. The three-second “Thinking…” state is intentionally simulated. Edit `content/background.json`, then rebuild. Conversation history lasts for the current page session and can be cleared in the panel.

## Document navigation

Projects highlights three featured repositories: Medallion Architecture, Platinum Fire, and Crime Data ETL. A GitHub link at the bottom points visitors to the complete project archive. Projects have stable fragment IDs and Copy section link actions; opening a project fragment automatically expands it. Keep these IDs stable when editing titles so shared links continue working. A Back to top button appears after scrolling down and returns focus to the page-options control.

## PDF export

Open the three-dot menu, choose **Export page as PDF**, then choose **Save as PDF** in the browser print dialog. Only the current document is printed. Application UI, menus, the background panel, share links, and reading controls are hidden. Project details are expanded before printing and restored afterward. Browser-generated headers and footers can be disabled in the print dialog.

## Checks

```sh
python3 scripts/build.py
node --check assets/js/main.js
python3 scripts/check.py
git diff --check
```

## Repository structure

- `content/`: editable page fragments and `background.json` answers.
- `scripts/build.py`: generates the shared production shell and route pages.
- `scripts/check.py`: validates route structure, metadata, assets, IDs, and links.
- `assets/css/main.css`: screen styles, design tokens, responsive layout, and controls.
- `assets/css/print.css`: print and PDF rules.
- `assets/js/main.js`: progressive enhancement and interactive behavior.
- `index.html`, `404.html`, and the seven route directories: GitHub Pages output.
- `LICENSE.txt`: retained attribution/license for the original template.

## Attribution

The original portfolio used **Dimension by HTML5 UP** (html5up.net, @ajlkn), distributed under the Creative Commons Attribution 3.0 license. Its legacy assets were removed; `LICENSE.txt` is retained.
