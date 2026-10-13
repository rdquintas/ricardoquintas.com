/*============================================
Cookie consent + Google Analytics 4
- GA is only loaded after the visitor clicks "Accept".
- The choice is stored in localStorage ("rq-cookie-consent").
- Any element with [data-cookie-settings] reopens the banner.
==============================================*/
(function () {
    // GA4 "Measurement ID" (Admin > Data streams > Web stream). Format: G-XXXXXXXXXX
    // GA4 property: 362914301
    var GA_MEASUREMENT_ID = 'G-XR31QSC7LV';

    var STORAGE_KEY = 'rq-cookie-consent';
    var scriptSrc = (document.currentScript && document.currentScript.src) || '';
    var PRIVACY_URL = scriptSrc ? scriptSrc.replace(/js\/consent\.js.*$/, 'privacy.html') : '/privacy.html';
    var gaLoaded = false;
    var banner;

    function getConsent() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setConsent(value) {
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch (e) { }
    }

    function loadAnalytics() {
        if (gaLoaded || !GA_MEASUREMENT_ID) return;
        gaLoaded = true;
        window['ga-disable-' + GA_MEASUREMENT_ID] = false;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID);

        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
        document.head.appendChild(s);
    }

    function removeAnalyticsCookies() {
        if (GA_MEASUREMENT_ID) window['ga-disable-' + GA_MEASUREMENT_ID] = true;
        var host = location.hostname;
        var domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
        document.cookie.split(';').forEach(function (c) {
            var name = c.split('=')[0].trim();
            if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' || name === '_gat') {
                domains.forEach(function (d) {
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
                });
            }
        });
    }

    function injectStyles() {
        var css =
            '#rq-cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:10000;background:#000;color:#fff;' +
            'border-top:7px solid #CB0000;padding:20px 16px;font-family:Raleway,Arial,sans-serif;font-size:15px;' +
            'font-weight:300;line-height:1.5;box-shadow:0 -4px 20px rgba(0,0,0,.3)}' +
            '#rq-cookie-banner[hidden]{display:none}' +
            '#rq-cookie-banner .rq-cb-inner{max-width:1140px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:16px 24px}' +
            '#rq-cookie-banner p{margin:0;flex:1 1 400px}' +
            '#rq-cookie-banner a{color:#fff;text-decoration:underline}' +
            '#rq-cookie-banner .rq-cb-actions{display:flex;gap:12px;flex-wrap:wrap}' +
            '#rq-cookie-banner button{font:inherit;font-size:16px;padding:8px 24px;border:2px solid #CB0000;border-radius:0;cursor:pointer;min-width:120px}' +
            '#rq-cookie-banner .rq-cb-accept{background:#CB0000;color:#fff}' +
            '#rq-cookie-banner .rq-cb-reject{background:transparent;color:#fff;border-color:#fff}' +
            '#rq-cookie-banner button:hover{opacity:.85}' +
            '#rq-cookie-banner button:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
            // Phones: smaller banner so it hides less of the page
            '@media (max-width:767px){#rq-cookie-banner{padding:12px 16px;font-size:13px;border-top-width:4px}' +
            '#rq-cookie-banner .rq-cb-inner{gap:10px}' +
            '#rq-cookie-banner p{flex-basis:100%}' +
            '#rq-cookie-banner .rq-cb-actions{flex:1 1 100%;gap:10px}' +
            '#rq-cookie-banner button{flex:1;min-width:0;padding:6px 12px;font-size:15px}}';
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    function buildBanner() {
        injectStyles();
        banner = document.createElement('div');
        banner.id = 'rq-cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.hidden = true;
        banner.innerHTML =
            '<div class="rq-cb-inner">' +
            '<p>This site uses cookies from Google Analytics to understand how it is used. ' +
            'They are only set if you accept. <a href="' + PRIVACY_URL + '">Privacy policy</a></p>' +
            '<div class="rq-cb-actions">' +
            '<button type="button" class="rq-cb-reject">Reject</button>' +
            '<button type="button" class="rq-cb-accept">Accept</button>' +
            '</div></div>';
        document.body.appendChild(banner);

        banner.querySelector('.rq-cb-accept').addEventListener('click', function () {
            setConsent('granted');
            hide();
            loadAnalytics();
        });
        banner.querySelector('.rq-cb-reject').addEventListener('click', function () {
            setConsent('denied');
            hide();
            removeAnalyticsCookies();
        });
    }

    function show() {
        if (!banner) buildBanner();
        banner.hidden = false;
    }

    function hide() {
        if (banner) banner.hidden = true;
    }

    function init() {
        var consent = getConsent();
        if (consent === 'granted') {
            loadAnalytics();
        } else if (consent !== 'denied') {
            show();
        }

        document.addEventListener('click', function (e) {
            var target = e.target.closest && e.target.closest('[data-cookie-settings]');
            if (target) {
                e.preventDefault();
                show();
            }
        });
    }

    window.rqCookieConsent = { open: show };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
