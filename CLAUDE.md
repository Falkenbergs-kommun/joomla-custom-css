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

- `bibliotek/` — Library site (bibliotek.falkenberg.se)
- `campusfalkenberg/` — Campus Falkenberg (campusfalkenberg.se)
- `elev/` — Student portal (elev.falkenberg.se)
- `externwebb/` — External website (kommun.falkenberg.se)
- `gymnasiehalland/` — Gymnasie Halland (gymnasiehalland.se)
- `gymnasieskolan/` — Falkenbergs gymnasieskola (falkenbergsgymnasieskola.se)
- `intranet/` — Intranet (dev-intra.falkenberg.se)
- `klitterbadet/` — Klitterbadet (klitterbadet.se)
- `vuxenutbildningen/` — Vuxenutbildningen (vuxenutbildningenfalkenberg.se)

Additional site directories may be added following the same pattern: `<site-name>/custom.css`

## CSS conventions

- The stylesheet targets **UIkit 3** (YOOtheme's framework) — selectors use `.uk-*` classes extensively.
- **EasySocial** (`#es`) component overrides form a significant portion of the styles.
- Custom component variants use Swedish class names (`.sidebarmenu`, `.falkmenu`, `.menykarta`, `.verksamhetsinformation`, `.kontaktkort`, `.observeraruta`, `.chefsinfo`, etc.).
- `!important` is used liberally to override YOOtheme's compiled styles — this is intentional and expected.
- Sections are separated by large comment banners (`/* === SECTION NAME === */`) — maintain this convention when adding new rules.
- Icon images are referenced via absolute paths from site root (e.g., `/images/plus.png`, `/images/interface/chevron.svg`).
- **Swedish hyphenation pattern** (for panels, cards, framed text blocks): combine `hyphens: auto` with `hyphenate-limit-chars: 7 3 3` (body) or `10 4 4` (headings) and `hyphenate-limit-lines: 2`. Keep `-webkit-` prefixes for iOS < 17. Do NOT use `word-break: break-word` — it bypasses the Swedish hyphenation dictionary and produces mid-word breaks at non-stavelse points. For short heading/label blocks, prefer `text-wrap: balance` over hyphenation. Always keep `overflow-wrap: break-word` as a last-resort fallback for words the dictionary can't break (URLs, odd proper nouns). Canonical example: `.uk-card-body p` in `intranet/custom.css`.

## Adding a new site

1. Create a directory named after the site (e.g., `externwebb/`)
2. Add `custom.css` with the site's styles
3. Symlink from the site's template directory: `ln -s /home/httpd/fbg-intranet/joomlaextensions/custom-styles-yootheme/<dir>/custom.css <site-template-path>/css/custom.css`
