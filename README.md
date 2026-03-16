# Custom Styles — YOOtheme

Centralt repo för anpassade CSS-stilmallar som används av YOOtheme child templates på Falkenbergs kommuns Joomla-sajter.

## Översikt

Varje underkatalog motsvarar en sajt och innehåller den `custom.css` som symlänkas in i sajtens template-katalog. Ändringar här slår igenom direkt — inget byggsteg behövs.

## Struktur

```
custom-styles-yootheme/
├── intranet/          # Intranätet (dev-intra.falkenberg.se)
│   └── custom.css
└── ...                # Fler sajter läggs till efter samma mönster
```

## Hur det fungerar

Filerna deployas via **absoluta symlänkar** från Joomlas template-katalog:

```
.../templates/yootheme_child/css/custom.css  →  .../custom-styles-yootheme/intranet/custom.css
```

Detta gör att alla CSS-anpassningar versionshanteras på ett ställe, medan Joomla/YOOtheme laddar filen som vanligt.

## Lägga till en ny sajt

1. Skapa en katalog med sajtens namn (t.ex. `externwebb/`)
2. Lägg till `custom.css` med sajtens stilar
3. Skapa symlänk från sajtens template-katalog:
   ```bash
   ln -s /home/httpd/fbg-intranet/joomlaextensions/custom-styles-yootheme/<katalog>/custom.css \
         <sajt-template-sökväg>/css/custom.css
   ```

## CSS-konventioner

- Stilarna riktar sig mot **UIkit 3** (YOOthemes ramverk) — selektorer använder `.uk-*`-klasser
- **EasySocial**-overrides (`#es`) utgör en stor del av intranätets stilar
- Egna komponentvarianter använder svenska klassnamn (`.sidebarmenu`, `.falkmenu`, `.menykarta`, `.verksamhetsinformation` m.fl.)
- `!important` används frekvent för att överskrida YOOthemes kompilerade stilar — detta är medvetet
- Sektioner separeras med kommentarsbanners: `/* === SEKTIONSNAMN === */`
- Ikonbilder refereras med absoluta sökvägar från sajtroten (t.ex. `/images/plus.png`)
