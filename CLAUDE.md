# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This repo is the **single source of truth** for custom CSS overrides used by YOOtheme child templates across Falkenberg municipality's Joomla sites. Each subdirectory maps to one site and contains the `custom.css` that is symlinked into that site's template directory.

## Deployment model

Files are deployed via **absolute symlinks** from the Joomla template directory back to this repo:

```
/home/httpd/fbg-intranet/intranet.example.com/templates/yootheme_child/css/custom.css
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
- `intranet/` — Intranet (intranet.example.com)
- `klitterbadet/` — Klitterbadet (klitterbadet.se)
- `vuxenutbildningen/` — Vuxenutbildningen (vuxenutbildningenfalkenberg.se)

Additional site directories may be added following the same pattern: `<site-name>/custom.css`

## Workflow: check the YOOtheme customizer first

Before adding a rule to `custom.css`, investigate whether the styling issue is an effect of YOOtheme **customizer settings**. If the same result can be achieved by moving a customizer setting toward its default, that is preferred. Always explore both the customizer and the custom CSS to decide where the fix is most effective.

- The customizer's compiled output lives at `<site>/templates/yootheme_child/css/theme.9.css` (externwebb runs the **parent** template: `kommun.falkenberg.se/templates/yootheme/css/theme.12.css`, and its `custom.css` symlink sits in that same parent dir) — grep it for the actual values (`.uk-margin`, heading margins, font sizes) and compare against UIkit defaults. A deviation there means the customizer is the cause.
- Known intranet customizer values: global margin `.uk-margin` = **40px** and `.uk-margin-small` = **24px** (UIkit defaults: 20/10px). This explains most "too much vertical spacing" issues between builder elements. Headings and paragraphs use 20px margins, so normal text rhythm is 20px.
- Fall back to `custom.css` when the customizer can't target the case (contextual rules like "ingress directly after h1") or when changing the global setting would affect the whole site.

## Third-party stylesheets load *after* `custom.css`

`custom.css` is linked early in `<head>` (position ~24 on externwebb); stylesheets pulled in by third-party
components load after it. On equal specificity the third party therefore wins, so a rule that *looks* strong
enough on paper can still be dead. Verify in the rendered page, not from the selector.

- Check load order: `curl -s <url> | grep -o '<link[^>]*rel="stylesheet"[^>]*>'` and compare positions.
- Ask the browser which rule actually won, rather than guessing — headless Chrome + CDP
  (`CSS.getMatchedStylesForNode`, or compare `getComputedStyle` before/after setting the declaration inline
  with `setProperty(prop, value, 'important')`). The compiled `theme.*.css` also carries customizer Custom CSS
  with `!important` (externwebb: `h2,h3,h4 { margin: 10px 0 5px 0 !important }`), and UIkit's own margin
  utilities (`.uk-margin-small-bottom` = `10px !important`) beat anything without `!important`.
- Document *why* each `!important` is there in a comment next to the rule — which stylesheet it answers.

**Cludo search (externwebb)**: the SERP is `/search`, and the search is driven by **hash** parameters
(`/search#?cludoquery=<term>&cludopage=1`); a plain `?cludoquery=` renders an empty page. `#cludo-search-results`
is hand-built markup in the YOOtheme builder; Cludo injects `.cludo-banner`, `ul > li.search-results-item > a >
(h2, p, span.path)` and `nav.cludo-page-navigation`. Its own `cludo-search.min.css` sets `margin: 30px 0` on
result items, `width: 31px` on pagination items, `word-break: break-all` on `.path` and hides `.cludo-sr-only`.

## CSS conventions

- The stylesheet targets **UIkit 3** (YOOtheme's framework) — selectors use `.uk-*` classes extensively.
- **EasySocial** (`#es`) component overrides form a significant portion of the styles.
- Custom component variants use Swedish class names (`.sidebarmenu`, `.falkmenu`, `.menykarta`, `.verksamhetsinformation`, `.kontaktkort`, `.observeraruta`, `.chefsinfo`, etc.).
- `!important` is used liberally to override YOOtheme's compiled styles — this is intentional and expected.
- Sections are separated by large comment banners (`/* === SECTION NAME === */`) — maintain this convention when adding new rules.
- **Body-text lists vs. menus** (externwebb): editor lists are class-less `<ul>`/`<ol>`, while every UIkit navigation list carries a class (`uk-nav`, `uk-navbar-nav`, `uk-subnav`, `uk-breadcrumb`, `uk-list`, `uk-dotnav`). Scope body-text list rules as `#tm-main :is(ul, ol):not([class]):not(nav *):not(#cludo-search-results *) > li + li` — `:not(nav *)` covers the class-less nested `ul` in the JP Automatic TOC and Cludo's facet list, and `li + li` keeps the space above the first and below the last item unchanged. Verify with a headless-Chrome match count on a content page, the start page and `/search#?cludoquery=…` (see the "LISTOR I BRÖDTEXT" block in `externwebb/custom.css`).
- Icon images are referenced via absolute paths from site root (e.g., `/images/plus.png`, `/images/interface/chevron.svg`).
- **Swedish hyphenation pattern** (for panels, cards, framed text blocks): combine `hyphens: auto` with `hyphenate-limit-chars: 7 3 3` (body) or `10 4 4` (headings) and `hyphenate-limit-lines: 2`. Keep `-webkit-` prefixes for iOS < 17. Do NOT use `word-break: break-word` — it bypasses the Swedish hyphenation dictionary and produces mid-word breaks at non-stavelse points. For short heading/label blocks, prefer `text-wrap: balance` over hyphenation. Always keep `overflow-wrap: break-word` as a last-resort fallback for words the dictionary can't break (URLs, odd proper nouns). Canonical example: `.uk-card-body p` in `intranet/custom.css`.

## Adding a new site

1. Create a directory named after the site (e.g., `externwebb/`)
2. Add `custom.css` with the site's styles
3. Symlink from the site's template directory: `ln -s /home/httpd/fbg-intranet/joomlaextensions/custom-styles-yootheme/<dir>/custom.css <site-template-path>/css/custom.css`
