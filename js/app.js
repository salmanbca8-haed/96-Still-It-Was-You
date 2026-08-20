/* ==========================================================================
   96 (2018) — MASTER APPLICATION CONTROLLER
   Lenis Smooth Scroll, GSAP ScrollTrigger, Parallax & Storytelling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lightbox first so other modules can bind to it
  window.lightboxInstance = new CinematicLightbox();

  // 2. Initialize Subsystems
  const soundscape = new AmbientSoundscape();
  const particles = new ParticleAtmosphere();
  const cursor = new CustomCursor();
  const memoryWall = new MemoryWall3D();
  const sceneExplorer = new SceneExplorer();
  const movieArchive = new MovieArchive();

  // 3. Preloader Progress Simulation & Entrance
  initPreloader();

  // 4. Smooth Scroll with Lenis
  initSmoothScroll();

  // 5. Navigation & Active Section Tracking
  initNavigation();

  // 6. Floating Canvas Parallax & Magnetic Cursor Reactivity
  initFloatingCanvas();

  // 7. Converging Frames (Ram & Jaanu Section 03)
  initConvergingSection();

  // 8. Horizontal Photo River Animation
  initPhotoRiver();

  // 9. Text Reveal Animations
  initTextReveals();
});

/* --------------------------------------------------------------------------
   Preloader Sequence
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress');
  const heroTitle = document.querySelector('.hero-title');
  const heroTag = document.querySelector('.hero-tag');
  const heroSub = document.querySelector('.hero-subtitle');
  const scrollInd = document.querySelector('.scroll-indicator');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 25 + 15;
    if (progress > 100) progress = 100;

    if (progressBar) progressBar.style.width = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');

        // Reveal Hero Elements
        if (typeof gsap !== 'undefined') {
          gsap.to(heroTag, { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: 'power3.out' });
          gsap.to(heroTitle, { opacity: 1, scale: 1, duration: 1.8, delay: 0.5, ease: 'power4.out' });
          gsap.to(heroSub, { opacity: 1, y: 0, duration: 1.4, delay: 0.9, ease: 'power3.out' });
          gsap.to(scrollInd, { opacity: 1, duration: 1, delay: 1.4, ease: 'power2.out' });
        } else {
          if (heroTag) heroTag.style.opacity = '1';
          if (heroTitle) heroTitle.style.opacity = '1';
          if (heroSub) heroSub.style.opacity = '1';
          if (scrollInd) scrollInd.style.opacity = '1';
        }
      }, 500);
    }
  }, 120);
}

/* --------------------------------------------------------------------------
   Lenis Smooth Scrolling & GSAP Integration
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    window.lenis = lenis;
  }
}

/* --------------------------------------------------------------------------
   Navigation Bar & Mobile Drawer
   -------------------------------------------------------------------------- */
function initNavigation() {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link-item a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active Section Detection
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    links.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Mobile menu toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (toggle) toggle.textContent = '☰';
      });
    });
  }

  // Smooth click scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        if (window.lenis) {
          window.lenis.scrollTo(target, { offset: -60, duration: 1.6 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Floating Memory Canvas (Section with Scattered Interactive Photos)
   -------------------------------------------------------------------------- */
function initFloatingCanvas() {
  const cards = document.querySelectorAll('.memory-photo-card');
  const container = document.querySelector('.floating-memory-section');

  if (!container || cards.length === 0) return;

  // Parallax on mouse move
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    cards.forEach((card, i) => {
      const speed = parseFloat(card.getAttribute('data-speed')) || (0.4 + (i % 3) * 0.3);
      const moveX = relX * 50 * speed;
      const moveY = relY * 50 * speed;
      const baseRot = parseFloat(card.getAttribute('data-rot')) || 0;

      card.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${baseRot}deg)`;
    });
  });

  // Card click opens Lightbox
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.photo-caption-title');
      const date = card.querySelector('.photo-caption-date');

      if (window.lightboxInstance && img) {
        window.lightboxInstance.openWithData({
          src: img.src,
          title: title ? title.textContent : 'Memory',
          desc: 'A preserved moment in Ram and Jaanu\'s visual journal.',
          date: date ? date.textContent : '2018',
          category: 'FLOATING MEMORY'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Ram & Jaanu Converging Frames (Section 03)
   -------------------------------------------------------------------------- */
function initConvergingSection() {
  const section = document.querySelector('.chapter-converge');
  const frameRam = document.querySelector('.frame-ram');
  const frameJaanu = document.querySelector('.frame-jaanu');

  if (!section || !frameRam || !frameJaanu) return;

  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'center center',
        scrub: 1.2
      }
    })
    .fromTo(frameRam, { x: '-60%', rotate: -8 }, { x: '18%', rotate: -1.5, ease: 'none' })
    .fromTo(frameJaanu, { x: '60%', rotate: 8 }, { x: '-18%', rotate: 1.5, ease: 'none' }, 0);
  } else {
    // Scroll event fallback
    window.addEventListener('scroll', () => {
      const rect = section.getBoundingClientRect();
      const progress = 1 - Math.max(0, Math.min(1, rect.top / window.innerHeight));
      
      const ramOffset = -50 + progress * 65;
      const jaanuOffset = 50 - progress * 65;

      frameRam.style.transform = `translateX(${ramOffset}%) rotate(-3deg)`;
      frameJaanu.style.transform = `translateX(${jaanuOffset}%) rotate(3deg)`;
    }, { passive: true });
  }
}

/* --------------------------------------------------------------------------
   Horizontal Photographic River (Section 05)
   -------------------------------------------------------------------------- */
function initPhotoRiver() {
  const wrapper = document.querySelector('.photo-river-wrapper');
  const section = document.querySelector('.chapter-river');
  if (!wrapper || !section) return;

  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    gsap.to(wrapper, {
      x: () => -(wrapper.scrollWidth - window.innerWidth + 120),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // Click on river items opens Lightbox
  wrapper.querySelectorAll('.river-item').forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || 'Memory River';
      if (window.lightboxInstance && img) {
        window.lightboxInstance.openWithData({
          src: img.src,
          title: title,
          desc: 'A continuous drifting photograph from Ram and Jaanu\'s visual chronicle.',
          date: '2018',
          category: 'THE MEMORIES'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Editorial Text Reveals on Scroll
   -------------------------------------------------------------------------- */
function initTextReveals() {
  const statements = document.querySelectorAll('.cinematic-statement');
  if (statements.length === 0) return;

  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    statements.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  } else {
    window.addEventListener('scroll', () => {
      statements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.style.transition = 'all 1s ease-out';
        }
      });
    }, { passive: true });
  }
}
