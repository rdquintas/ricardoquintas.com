(function () {
    'use strict';

    var doc = document.documentElement;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Touch devices skip the scroll animations (see .touch rules in styles.css)
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        doc.classList.add('touch');
    }

    var year = document.querySelector('footer .year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    /*============================================
    Background video: desktop only, no reduced motion, no data saver
    ==============================================*/
    var video = document.getElementById('myVideo');
    var saveData = navigator.connection && navigator.connection.saveData;
    if (video && !reducedMotion && !saveData &&
        window.matchMedia('(min-width: 768px)').matches) {
        video.preload = 'auto';
        var playing = video.play();
        if (playing && playing.catch) {
            playing.catch(function () { /* autoplay blocked: poster stays */ });
        }
    }

    /*============================================
    Scroll animations
    ==============================================*/
    var animated = document.querySelectorAll('.scrollimation');
    if (reducedMotion || !('IntersectionObserver' in window)) {
        animated.forEach(function (el) { el.classList.add('in'); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });
        animated.forEach(function (el) { revealObserver.observe(el); });
    }

    /*============================================
    Skills logic
    ==============================================*/
    document.querySelectorAll('.skill-per').forEach(function (el) {
        var years = parseInt(el.getAttribute('years'), 10);
        var maxYear = parseInt(el.getAttribute('maxYear'), 10);
        el.style.width = (years * 100 / maxYear) + '%';
    });

    /*============================================
    Navigation + header fade on scroll
    ==============================================*/
    var nav = document.getElementById('main-nav');
    var homeContainer = document.querySelector('#home .container');
    var ticking = false;

    function onScroll() {
        var st = window.pageYOffset;
        if (homeContainer) {
            homeContainer.style.opacity = 1.4 - st / 400;
        }
        if (nav) {
            // Pages without the hero (e.g. portfolio) keep the solid nav
            nav.classList.toggle('scrolled', !homeContainer || st >= window.innerHeight - 300);
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();

    /*============================================
    Mobile menu toggle
    ==============================================*/
    var toggle = document.querySelector('.navbar-toggle');
    var siteNav = document.getElementById('site-nav');
    if (toggle && siteNav) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', function () {
            var open = siteNav.classList.toggle('in');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    /*============================================
    ScrollTo links
    ==============================================*/
    document.querySelectorAll('a.scrollto').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var target = document.querySelector(link.hash);
            if (!target) {
                return;
            }
            e.preventDefault();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.pageYOffset - 70,
                behavior: reducedMotion ? 'auto' : 'smooth'
            });
            if (siteNav && siteNav.classList.contains('in')) {
                siteNav.classList.remove('in');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    /*============================================
    Scrollspy: highlight the nav item of the visible section
    ==============================================*/
    var spyLinks = document.querySelectorAll('#main-nav a.scrollto');
    if ('IntersectionObserver' in window && spyLinks.length) {
        var spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }
                spyLinks.forEach(function (link) {
                    link.parentNode.classList.toggle('active', link.hash === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        spyLinks.forEach(function (link) {
            var section = document.querySelector(link.hash);
            if (section) {
                spyObserver.observe(section);
            }
        });
    }
})();
