# Intranätet – custom.css utvecklingsanteckningar

## Sidlayouter och selektorer

Intranätet har **två olika sidlayouter** som renderar innehåll på olika sätt. Detta påverkar vilka CSS-selektorer som matchar.

### Sidebar-layout (de flesta sidor)

Sidor som tillhör en menystruktur (t.ex. Ledning och styrning, Organisation) renderas med Joomlas traditionella layout:

```
#tm-main > .uk-container > .uk-grid
  ├── .uk-width-expand@m   ← får uk-first-column av UIkit
  │     └── [data-id="page#0"] .uk-panel[data-element]  ← sidinnehåll
  └── aside#tm-sidebar .uk-panel   ← sidomeny (INTE data-element)
```

**Matchande selektorer:** `#tm-main .uk-first-column ul/ol`

### Helbreddslayout (YooTheme Page Builder)

Sidor som saknar sidomeny (t.ex. Typografitest) renderas direkt av sidbyggaren:

```
[data-id="page#0"] .uk-section-default
  └── .uk-container > .uk-grid > .uk-width-1-1
        └── .uk-panel[data-element]   ← sidinnehåll
```

**Inget** `#tm-main` finns i DOM:en. Selektorn `#tm-main .uk-first-column` matchar inte.

**Matchande selektorer:** `.uk-panel[data-element] ul/ol`

### Accordions

Accordioninnehåll renderas i:

```
.uk-accordion-content
  └── .el-content.uk-panel   ← UTAN data-element
```

Panelen har `.uk-panel` men **saknar** `data-element`. Regeln `.uk-panel[data-element]` matchar inte. Däremot matchar `#tm-main .uk-first-column ul` om sidan har sidebar-layout.

---

## Temats (theme.9.css) standardavstånd

| Element | Egenskap | Värde | Notering |
|---------|----------|-------|----------|
| `*+h1, *+h2, *+h3, *+h4, *+h5, *+h6` | margin-top | 40px | Alla rubriker föregångna av annat element |
| `p` | margin-bottom | 30px | Webbläsarstandard ~16px, men temat sätter 30px |
| `ul, ol` | margin-bottom | 30px | Webbläsarstandard ~16px, men temat sätter 30px |
| `h2, h3, h4` | margin-bottom | 10px | Via UIkit (varierar) |
| `.uk-accordion-content` | margin-top | 10px | Avstånd mellan rubrik och innehåll |
| `.uk-accordion-content > :last-child` | margin-bottom | 0 | Tar bort margin på sista barnet |

---

## Custom.css-regler som påverkar typografi och avstånd

### Borttagna regler (2026-03-16)

Följande regler **har tagits bort** från custom.css:

- `p { margin-top: 5px !important; }` — Satte en liten margin-top på alla `<p>`
- `h2, h3, h4 { margin-bottom: 10px; }` — Satte margin-bottom på rubriker
- `h5 { margin: 0px 0px 10px 0px; }` — Nollställde margin-top på h5
- `*+h1, *+h2, *+h3, *+h4, *+h5, *+h6 { margin-top: 0px !important; }` — Tog bort ALL margin-top ovanför rubriker

Dessa regler orsakade att rubriker kletsade ihop med föregående element.

### Befintliga listregler (sektionen "List style content")

```css
/* Mellanrum mellan list-items */
#tm-main .uk-first-column ul li, .uk-panel[data-element] ul li { margin-bottom: 0.5em; }

/* Inget avstånd efter sista list-item */
...:last-child { margin-bottom: 0; }

/* Nollställ margin-bottom på hela listan */
#tm-main .uk-first-column ul, .uk-panel[data-element] ul { margin-bottom: 0 !important; }

/* Återställ avstånd ovanför rubrik som följer en lista */
#tm-main ul + h2/h3/h4, .uk-panel[data-element] ul + h2/h3/h4 { margin-top: 30px !important; }
```

---

## Kända utmaningar och fallgropar

### 1. `data-element` som selektor-avgränsare

YooThemes sidbyggare lägger till `data-element` (utan värde) på innehållspaneler men **inte** på navigationsmoduler. Det gör `.uk-panel[data-element]` till en säker avgränsare som undviker sidomenyer.

**Risk:** Om YooTheme ändrar sitt sätt att rendera `data-element` i framtida versioner kan selektorn sluta fungera.

### 2. Dubbelselektorn behövs

Två parallella selektorer behövs för varje regel:
- `#tm-main .uk-first-column ...` — för sidebar-sidor
- `.uk-panel[data-element] ...` — för helbreddssidor (sidbyggarsidor)

### 3. Accordioninnehåll matchar annorlunda

Accordionens `.uk-panel` saknar `data-element`, så bara `#tm-main .uk-first-column`-varianten matchar där. Om en helbreddssida (utan `#tm-main`) skulle innehålla en accordion, matchar **ingen** av selektorerna inuti den.

### 4. `!important` är nödvändigt

Temats kompilerade CSS och den befintliga custom.css använder `!important` extensivt. Nya regler som ska slå dessa måste också använda `!important`. Detta är förväntat beteende för YooTheme-projekt.

### 5. Margin collapse

CSS margin collapse innebär att angränsande vertikala marginaler slås ihop (den största vinner). `padding` och `border` bryter margin collapse. `.uk-accordion-content` har `padding: 20px` och `border`, vilket bryter collapse för element direkt innanför accordion-boxen.

---

## Teststrategi

Testa alltid CSS-ändringar på minst tre sidtyper:

1. **Sidebar-sida** (t.ex. Förvaltningsmodell för IT) — har `#tm-main`, sidebar, `uk-first-column`
2. **Helbreddssida/sidbyggarsida** (t.ex. Typografitest) — saknar `#tm-main`, använder `data-element`
3. **Sida med accordion** (t.ex. Vid brand i Stadshuset) — innehåll inuti `.uk-accordion-content`

Kontrollera särskilt:
- Avstånd före och efter `<ul>`/`<ol>`
- Avstånd mellan `<ul>` och efterföljande rubrik (`<h2>`/`<h3>`)
- Att sidomenyn (sidebar) inte påverkas
- Att mobilmenyn inte påverkas

---

## Filreferenser

- **custom.css:** `/home/httpd/fbg-intranet/joomlaextensions/custom-styles-yootheme/intranet/custom.css`
- **Symlänk:** `/home/httpd/fbg-intranet/dev-intra.falkenberg.se/templates/yootheme_child/css/custom.css` → ovanstående
- **Tema-CSS:** `/home/httpd/fbg-intranet/dev-intra.falkenberg.se/templates/yootheme_child/css/theme.9.css` (minifierad)
