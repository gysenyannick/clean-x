(function () {
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navMobile = document.getElementById('navMobile');
  var yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      navMobile.classList.toggle('open');
    });
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        navMobile.classList.remove('open');
      });
    });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  var heroVideo = document.querySelector('.hero-media video');
  if (heroVideo) {
    var tryPlay = function () { heroVideo.play().catch(function () {}); };
    tryPlay();
    heroVideo.addEventListener('canplay', tryPlay, { once: true });
    heroVideo.addEventListener('loadeddata', tryPlay, { once: true });
  }

  var heroImg = document.querySelector('.hero-media img, .hero-media video');
  if (heroImg) {
    document.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = 'scale(1.08) translateY(' + (y * 0.12) + 'px)';
      }
    }, { passive: true });
  }

  // Contact form — no backend, so build a pre-filled mailto: draft on submit.
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(contactForm);
      var lines = [
        'Naam: ' + (data.get('name') || ''),
        'Bedrijfsnaam: ' + (data.get('company') || ''),
        'E-mail: ' + (data.get('email') || ''),
        'Telefoonnummer: ' + (data.get('phone') || ''),
        'Postcode locatie: ' + (data.get('postcode') || ''),
        'Type voertuig(en): ' + (data.get('vehicles') || ''),
        'Grootte wagenpark: ' + (data.get('fleetsize') || ''),
        'Gewenste frequentie: ' + (data.get('frequency') || ''),
        '',
        'Overige informatie:',
        (data.get('message') || '')
      ];
      var subject = encodeURIComponent('Contactformulier - CLEAN-X');
      var body = encodeURIComponent(lines.join('\n'));
      window.location.href = 'mailto:info@clean-x.be?subject=' + subject + '&body=' + body;
    });
  }

  // Van drive-in animation, tied to scroll progress through the intro section.
  var van = document.getElementById('introVan');
  if (van) {
    if (!window.gsap || !window.ScrollTrigger) {
      van.style.transform = 'none';
    } else {
      gsap.registerPlugin(ScrollTrigger);
      var isMobile = window.matchMedia('(max-width: 860px)').matches;
      var startX = isMobile ? 70 : 130;

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.why',
          start: isMobile ? 'top 60%' : 'top 75%',
          end: isMobile ? 'top 30%' : 'top 30%',
          scrub: 0.6
        }
      });

      tl.fromTo(van,
        { xPercent: startX, y: 0 },
        { xPercent: -2, y: 7, ease: 'power2.out', duration: 0.85 }
      ).to(van,
        { xPercent: 0, y: 0, ease: 'power1.out', duration: 0.15 }
      );
    }
  }

  // ---- Finishing touches ----
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var svgArrowUp = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  var svgPhone = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>';

  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  var toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Terug naar boven');
  toTop.innerHTML = svgArrowUp;
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
  document.body.appendChild(toTop);

  var quoteHref = document.getElementById('contact') ? '#contact' : 'index.html#contact';
  var mobileCta = document.createElement('div');
  mobileCta.className = 'mobile-cta';
  mobileCta.innerHTML = '<a class="mc-call" href="tel:+32468352869">' + svgPhone + 'Bel ons</a><a class="mc-quote" href="' + quoteHref + '">Plan bezoek</a>';
  document.body.appendChild(mobileCta);

  function onScrollExtras() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = 'scaleX(' + p + ')';
    toTop.classList.toggle('show', window.scrollY > 700);
    mobileCta.classList.toggle('show', window.scrollY > 500 && !navMobile.classList.contains('open'));
  }
  document.addEventListener('scroll', onScrollExtras, { passive: true });
  onScrollExtras();

  // Active nav link while scrolling through sections on the homepage.
  var spyLinks = [];
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var m = (a.getAttribute('href') || '').match(/#([\w-]+)$/);
    if (m && document.getElementById(m[1])) spyLinks.push({ a: a, el: document.getElementById(m[1]) });
  });
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        spyLinks.forEach(function (s) { s.a.classList.toggle('is-active', s.el === entry.target); });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    spyLinks.forEach(function (s) { spy.observe(s.el); });
    var firstEl = document.getElementById('top');
    if (firstEl) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) spyLinks.forEach(function (s) { s.a.classList.remove('is-active'); });
      }, { rootMargin: '-40% 0px -50% 0px' }).observe(firstEl);
    }
  }

  // Pointer parallax on the hero portrait (desktop only).
  var heroWoman = document.querySelector('.hero-woman img');
  var heroSection = document.querySelector('.hero');
  if (heroWoman && heroSection && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    heroSection.addEventListener('mousemove', function (e) {
      var r = heroSection.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      heroWoman.style.transform = 'translate(' + (x * -18).toFixed(1) + 'px,' + (y * -10).toFixed(1) + 'px)';
    });
    heroSection.addEventListener('mouseleave', function () { heroWoman.style.transform = ''; });
  }

  // Toast after the contact form is submitted.
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  var toastTimer;
  window.xgToast = function (msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 5200);
  };
  var cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', function () {
    window.xgToast('Bedankt! Uw e-mailapp opent met een ingevuld bericht. Verstuur het en wij nemen snel contact op.');
  });
})();
