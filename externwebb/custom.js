/* Paus/spela-knapp för bakgrundsvideor (kommun.falkenberg.se, falkenbergsgymnasieskola.se)
 *
 * WCAG 2.2.2 (Pausa, stoppa, dölj): rörligt innehåll som startar automatiskt och pågår mer än
 * 5 sekunder ska gå att pausa. Gäller YOOthemes bakgrundsvideor (sektion/kolumn = <video uk-cover>)
 * och andra videor som spelar automatiskt i loop utan egna kontroller.
 *
 * - Knappen läggs först i videons behållare, så att den nås tidigt med tabb.
 * - Med "minska rörelse" (prefers-reduced-motion) startar videon pausad.
 * - UIkit startar om uk-cover-videor vid scroll/storleksändring. När besökaren har pausat
 *   blockeras därför play() på just den videon tills hen själv trycker på spela igen.
 *
 * Laddas automatiskt av YOOtheme som ~theme/js/custom.js (symlänk till joomla-custom-css/externwebb/;
 * gymnasieskolan/custom.js är en symlänk hit, så filen är gemensam). Stilen finns i respektive
 * sajts custom.css, blocket "PAUSKNAPP FÖR BAKGRUNDSVIDEO".
 */
(function () {
    'use strict';

    var TEXT_PAUSA = 'Pausa bakgrundsvideon';
    var TEXT_SPELA = 'Spela bakgrundsvideon';
    var IKON_PAUSA = '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><rect x="5" y="4" width="3.5" height="12" rx="1"/><rect x="11.5" y="4" width="3.5" height="12" rx="1"/></svg>';
    var IKON_SPELA = '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path d="M6 4.2v11.6a.8.8 0 0 0 1.2.7l9.3-5.8a.8.8 0 0 0 0-1.4L7.2 3.5A.8.8 0 0 0 6 4.2z"/></svg>';
    var nativePlay = HTMLMediaElement.prototype.play;
    var minskaRorelse = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function arBakgrundsvideo(video) {
        return video.hasAttribute('uk-cover') ||
            (video.loop && video.muted && !video.controls && (video.autoplay || video.hasAttribute('uk-video')));
    }

    function pausaAvBesokaren(video) {
        video.dataset.fbgPausad = '1';
        // Hindra UIkit från att starta om videon vid scroll/storleksändring.
        video.play = function () { return Promise.resolve(); };
        video.pause();
    }

    function spelaAvBesokaren(video) {
        delete video.dataset.fbgPausad;
        delete video.play; // tillbaka till HTMLMediaElement.prototype.play
        var p = nativePlay.call(video);
        if (p && p.catch) { p.catch(function () {}); }
    }

    function uppdatera(knapp, video) {
        var pausad = video.dataset.fbgPausad === '1';
        knapp.innerHTML = (pausad ? IKON_SPELA : IKON_PAUSA) +
            '<span class="uk-hidden-visually">' + (pausad ? TEXT_SPELA : TEXT_PAUSA) + '</span>';
        knapp.title = pausad ? TEXT_SPELA : TEXT_PAUSA;
    }

    function lagTillKnapp(video) {
        if (video.dataset.fbgKnapp || !arBakgrundsvideo(video)) { return; }
        video.dataset.fbgKnapp = '1';

        var behallare = video.parentElement;
        if (window.getComputedStyle(behallare).position === 'static') {
            behallare.style.position = 'relative';
        }

        var knapp = document.createElement('button');
        knapp.type = 'button';
        knapp.className = 'fbg-videopaus';
        knapp.addEventListener('click', function () {
            if (video.dataset.fbgPausad === '1') { spelaAvBesokaren(video); } else { pausaAvBesokaren(video); }
            uppdatera(knapp, video);
        });

        if (minskaRorelse) { pausaAvBesokaren(video); }
        uppdatera(knapp, video);
        behallare.insertBefore(knapp, behallare.firstChild);
    }

    function start() {
        Array.prototype.forEach.call(document.querySelectorAll('video'), lagTillKnapp);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
