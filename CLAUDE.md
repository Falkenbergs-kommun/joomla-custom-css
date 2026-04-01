# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This repo is the **single source of truth** for custom CSS overrides used by YOOtheme child templates across Falkenberg municipality's Joomla sites. Each subdirectory maps to one site and contains the `custom.css` that is symlinked into that site's template directory.

## Deployment model

Files are deployed via **absolute symlinks** from the Joomla template directory back to this repo:

```
/home/httpd/fbg-intranet/dev-intra.falkenberg.se/templates/yootheme_child/css/custom.css
  → /home/httpd/fbg-intranet/joomlaextensions/custom-styles-yootheme/intranet/custom.css
```

Changes to CSS files here take effect immediately on the corresponding site — there is no build step, compilation, or cache-busting required at the repo level (though Joomla/browser caching may apply).

## Structure

- `intranet/` — Styles for the intranet site (dev-intra.falkenberg.se)
- `externwebb/` — Styles for the external website (kommun.falkenberg.se)
- Additional site directories may be added following the same pattern: `<site-name>/custom.css`

## CSS conventions

- The stylesheet targets **UIkit 3** (YOOtheme's framework) — selectors use `.uk-*` classes extensively.
- **EasySocial** (`#es`) component overrides form a significant portion of the styles.
- Custom component variants use Swedish class names (`.sidebarmenu`, `.falkmenu`, `.menykarta`, `.verksamhetsinformation`, `.kontaktkort`, `.observeraruta`, `.chefsinfo`, etc.).
- `!important` is used liberally to override YOOtheme's compiled styles — this is intentional and expected.
- Sections are separated by large comment banners (`/* === SECTION NAME === */`) — maintain this convention when adding new rules.
- Icon images are referenced via absolute paths from site root (e.g., `/images/plus.png`, `/images/interface/chevron.svg`).

## Adding a new site

1. Create a directory named after the site (e.g., `externwebb/`)
2. Add `custom.css` with the site's styles
3. Symlink from the site's template directory: `ln -s /home/httpd/fbg-intranet/joomlaextensions/custom-styles-yootheme/<dir>/custom.css <site-template-path>/css/custom.css`
