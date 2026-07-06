/* Cobblers & Keys — shared behaviour: nav toggle, scroll-reveal, progress line. */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.setAttribute("data-open", String(!open));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.setAttribute("data-open", "false");
      });
    });
  }

  var revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach(function (el) {
    var delay = el.getAttribute("data-reveal-delay");
    if (delay) el.style.setProperty("--reveal-delay", delay);
  });
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  var progressFill = document.querySelector(".scroll-progress__fill");
  if (progressFill) {
    var ticking = false;
    var updateProgress = function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressFill.style.setProperty("--progress", pct + "%");
      ticking = false;
    };
    document.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
    }, { passive: true });
    updateProgress();
  }

  /* Hero "photo settle" reveal: used on the home hero, and the smaller-scale
     story-hero / intro banners on about.html and contact.html. Mostly CSS-driven
     via transitions/keyframes, but each page's markup nests the photo, rule and
     [data-hero-patina] host differently (host = photo's own wrapper on the home
     hero, host = the photo itself on the contact intro, host = the whole
     <section> on the about story-hero) — so rather than rely on fragile
     cross-branch CSS combinators, this hook explicitly flags every element that
     actually needs the class: the [data-hero-patina] host itself, plus any
     .hero__image / .story-hero__image / .intro__image and .hero__rule /
     .story-hero__rule / .intro__rule present on the page. */
  var heroPatina = document.querySelector("[data-hero-patina]");
  if (heroPatina) {
    var patinaTargets = [heroPatina].concat(
      Array.prototype.slice.call(document.querySelectorAll(
        ".hero__image, .story-hero__image, .intro__image, .hero__rule, .story-hero__rule, .intro__rule"
      ))
    );
    if (reduceMotion) {
      patinaTargets.forEach(function (el) { el.classList.add("is-active", "is-static"); });
    } else {
      requestAnimationFrame(function () {
        setTimeout(function () {
          patinaTargets.forEach(function (el) { el.classList.add("is-active"); });
        }, 200);
      });
    }
  }
})();
