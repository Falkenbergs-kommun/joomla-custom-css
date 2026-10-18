#!/usr/bin/env bash
# Stoppar url() med absolut adress (eller protokollrelativ //) i custom.css.
# Konvention: sökväg från sajtroten (/images/…, /modules/…), och filen ska finnas i sajtens egen docroot.
# Skäl: CSS-masker kräver CORS mellan domäner, och en sajt ska inte bero på en annan sajts domän eller servernamn.
set -euo pipefail
cd "$(dirname "$0")"
# Externa tjänster (inte egna sajter) som får laddas med absolut adress:
ALLOWED='fonts\.googleapis\.com|fonts\.gstatic\.com'
hits=$(grep -rnoE --include=custom.css "url\([\"']?(https?:)?//[^)]*\)" . | grep -vE "//($ALLOWED)/" || true)
if [ -n "$hits" ]; then
  echo "Absoluta adresser i url() – använd sökväg från sajtroten i stället:"
  echo "$hits"
  exit 1
fi
echo "OK: inga absoluta adresser i url()."
