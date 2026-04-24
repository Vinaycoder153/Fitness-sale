/* ============================================================
   FITCOACH PRO — SCRIPT
   Scroll reveal · Smooth scroll · Sticky CTA · Navbar scroll
   ============================================================ */

(function () {
  'use strict';

  // Mark body so CSS reveal animations only kick in when JS is running
  document.body.classList.add('js-ready');

  // ─── NAVBAR SCROLL BEHAVIOUR ────────────────────────────────
  const navbar = document.getElementById('navbar');

  function onNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onNavbarScroll, { passive: true });
  onNavbarScroll(); // run once on load


  // ─── HAMBURGER MOBILE MENU ──────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when any link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });


  // ─── STICKY WHATSAPP CTA ────────────────────────────────────
  const stickyCta = document.getElementById('sticky-cta');
  const heroSection = document.getElementById('hero');

  function onStickyCta() {
    // Show after user scrolls past the hero section
    const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 400;
    if (heroBottom < 0) {
      stickyCta.classList.add('visible');
    } else {
      stickyCta.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onStickyCta, { passive: true });
  onStickyCta();


  // ─── SCROLL REVEAL ANIMATION ────────────────────────────────
  // Uses IntersectionObserver for performant scroll-driven reveals.
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once revealed, stop observing (one-shot animation)
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,       // trigger when 8% of the element is visible
        rootMargin: '0px 0px -20px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

    // Immediately reveal any elements already inside the viewport on first paint
    // (important for above-the-fold hero content on fast connections / SSR).
    requestAnimationFrame(function () {
      revealElements.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
          revealObserver.unobserve(el);
        }
      });
    });
  }


  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────
  // Handles the offset caused by the fixed navbar height.
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  // ─── ACTIVE NAV LINK HIGHLIGHT ──────────────────────────────
  // Highlights the nav link matching the currently visible section.
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNav() {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = '#' + section.id;
      }
    });

    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === current);
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

})();
