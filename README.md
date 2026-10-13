# Custom Styles — YOOtheme

Centralt repo för anpassade CSS-stilmallar som används av YOOtheme child templates på Falkenbergs kommuns Joomla-sajter.

## Översikt

Varje underkatalog motsvarar en sajt och innehåller den `custom.css` som symlänkas in i sajtens template-katalog. Ändringar här slår igenom direkt — inget byggsteg behövs.

## Struktur

```
custom-styles-yootheme/
├── bibliotek/            # Biblioteket (bibliotek.falkenberg.se)
├── campusfalkenberg/     # Campus Falkenberg (campusfalkenberg.se)
├── elev/                 # Elevportalen (elev.falkenberg.se)
├── externwebb/           # Externwebben (kommun.falkenberg.se)
├── gymnasiehalland/      # Gymnasie Halland (gymnasiehalland.se)
├── gymnasieskolan/       # Falkenbergs gymnasieskola (falkenbergsgymnasieskola.se)
├── intranet/             # Intranätet (utvecklingsmiljön)
├── klitterbadet/         # Klitterbadet (klitterbadet.se)
└── vuxenutbildningen/    # Vuxenutbildningen (vuxenutbildningenfalkenberg.se)
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

## Regel: intranätet och kommunwebben följs åt

Sedan 2026-10-13 har intranätet och kommun.falkenberg.se samma grundtypografi (20px bas, rubrikskala,
ingress/meta/large samt mindre storlekar under 960px), och så ska det förbli. En ändring i gemensam
typografi eller gemensam styling görs alltid på **båda** sajterna i samma arbete:

- Customizer-inställningar under Global / Base / Text / Heading får samma värden på båda sajterna.
  Sajterna kör olika preset (`yard` på intranätet, `design-escapes` på externwebben), så jämför den
  kompilerade CSS:en (`theme.9.css` mot `theme.12.css`), inte fältens utgångsvärden.
- Typografiblock i detta repo hålls identiska i `intranet/custom.css` och `externwebb/custom.css`
  (t.ex. "TYPOGRAFI I MOBIL"). Sajtspecifika komponenter (Cludo, EasySocial, menyer) är undantagna.

## CSS-konventioner

- Stilarna riktar sig mot **UIkit 3** (YOOthemes ramverk) — selektorer använder `.uk-*`-klasser
- **EasySocial**-overrides (`#es`) utgör en stor del av intranätets stilar
- Egna komponentvarianter använder svenska klassnamn (`.sidebarmenu`, `.falkmenu`, `.menykarta`, `.verksamhetsinformation` m.fl.)
- `!important` används frekvent för att överskrida YOOthemes kompilerade stilar — detta är medvetet
- Sektioner separeras med kommentarsbanners: `/* === SEKTIONSNAMN === */`
- Ikonbilder refereras med absoluta sökvägar från sajtroten (t.ex. `/images/plus.png`)
