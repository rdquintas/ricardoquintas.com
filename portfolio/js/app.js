(function () {
  "use strict";

  var BATCH_SIZE = 6;

  var SKILL_COLORS = {
    REACT: "blue",
    NodeJS: "green",
    PHP: "purple",
    Bootstrap: "light-blue",
    Javascript: "yellow",
    JAVA: "light-green",
  };

  var grid = document.getElementById("projects");
  var sentinel = document.getElementById("projects-sentinel");
  var loader = document.getElementById("page-loader");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var projects = shuffle(window.projects.slice());
  var cursor = 0;
  var loading = false;
  var firstBatch = true;

  var msnry = new Masonry(grid, {
    itemSelector: ".zrq-card",
    columnWidth: ".zrq-grid-sizer",
    gutter: ".zrq-gutter-sizer",
    percentPosition: true,
    transitionDuration: reduceMotion ? 0 : "0.4s",
  });

  // Re-layout whenever a card changes height after Masonry placed it
  // (web font swap, late images, text reflow), so cards never overlap the footer
  var relayoutQueued = false;
  var resizeObserver =
    "ResizeObserver" in window
      ? new ResizeObserver(function () {
          if (relayoutQueued) return;
          relayoutQueued = true;
          window.requestAnimationFrame(function () {
            relayoutQueued = false;
            msnry.layout();
          });
        })
      : null;
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      msnry.layout();
    });
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function esc(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function cardHTML(p) {
    var url = p.url || {};
    // projects.js names the source image; tools/build-images.py generates .avif + .webp
    var base = "img/" + esc(p.image.replace(/\.\w+$/, ""));
    var img =
      '<picture><source srcset="' + base + '.avif" type="image/avif">' +
      '<img src="' + base + '.webp" alt="' + esc(p.name) + '" loading="lazy"></picture>';

    var image = url.preview
      ? '<a target="_blank" rel="noopener" href="' + esc(url.preview) + '">' + img + "</a>"
      : img;

    var site = url.liveSite
      ? '<a class="normal bottom-line" target="_blank" rel="noopener" href="' + esc(url.liveSite) + '"><strong>' + esc(url.simple) + "</strong></a>"
      : "";

    var buttons = "";
    if (url.preview) {
      buttons += '<a href="' + esc(url.preview) + '" target="_blank" rel="noopener" class="primary button">Preview</a>';
    }
    if (url.github) {
      buttons += '<a href="' + esc(url.github) + '" target="_blank" rel="noopener" class="button" title="Github"><i class="fa fa-github"></i> Source Code</a>';
    }

    var tags = p.skills
      .map(function (s) {
        return '<li class="tag ' + (SKILL_COLORS[s] || "grey") + '">' + esc(s) + "</li>";
      })
      .join("");

    // description is trusted HTML from projects.js
    return (
      '<div class="zrq-card-inner">' +
      '<div class="image">' + image + "</div>" +
      '<div class="content">' +
      "<h4>" + esc(p.name) + "</h4>" +
      '<div class="site">' + site + "</div>" +
      '<div class="description">' + p.description + "</div>" +
      (buttons ? '<div class="buttons">' + buttons + "</div>" : "") +
      '<div class="skills"><h5>Skills used:</h5><ul class="clearfix tags">' + tags + "</ul></div>" +
      "</div>" +
      "</div>"
    );
  }

  function createCard(p) {
    var el = document.createElement("article");
    el.className = "zrq-card";
    el.innerHTML = cardHTML(p);
    return el;
  }

  // ---------------------------------------------------------------------------
  // Load on scroll
  // ---------------------------------------------------------------------------

  function hasMore() {
    return cursor < projects.length;
  }

  function loadMore() {
    if (loading || !hasMore()) return;
    loading = true;

    var batch = projects.slice(cursor, cursor + BATCH_SIZE);
    cursor += batch.length;

    var fragment = document.createDocumentFragment();
    var items = batch.map(function (p) {
      var el = createCard(p);
      fragment.appendChild(el);
      return el;
    });

    // Add hidden, lay out once images are known, then fade in
    grid.appendChild(fragment);
    imagesLoaded(items, function () {
      msnry.appended(items);
      msnry.layout();
      if (resizeObserver) {
        items.forEach(function (el) {
          resizeObserver.observe(el.firstChild);
        });
      }

      // force a reflow so the transition runs from the hidden state
      void grid.offsetHeight;
      items.forEach(function (el, i) {
        el.style.transitionDelay = reduceMotion ? "0ms" : i * 80 + "ms";
        el.classList.add("is-visible");
      });

      if (firstBatch) {
        firstBatch = false;
        loader.classList.add("is-hidden");
      }

      loading = false;
      sentinel.classList.toggle("is-done", !hasMore());
      // Keep loading if the sentinel is still on screen (e.g. tall viewport)
      if (hasMore() && sentinelVisible()) loadMore();
    });
  }

  function sentinelVisible() {
    var rect = sentinel.getBoundingClientRect();
    return rect.top < window.innerHeight + 200;
  }

  function checkSentinel() {
    if (!loading && hasMore() && sentinelVisible()) loadMore();
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "0px 0px 200px 0px" }
    ).observe(sentinel);
  }
  // Fallback / safety net for browsers where the observer doesn't fire
  window.addEventListener("scroll", checkSentinel, { passive: true });
  window.addEventListener("resize", checkSentinel);

  loadMore();
})();
