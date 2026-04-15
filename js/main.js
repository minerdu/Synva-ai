/* ================================================================
   Agent.AI — English Static Site
   Main JavaScript — Interactions & Animations
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Mobile Menu Toggle ---
  const mobileBtn = document.querySelector('.header__mobile-btn');
  const nav = document.querySelector('.header__nav');

  if (mobileBtn && nav) {
    const spans = mobileBtn.querySelectorAll('span');

    mobileBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      if (nav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu when clicking a nav link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        const spans = mobileBtn.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add('visible'));
    } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
    }
  }

  // --- Header Background on Scroll ---
  const header = document.querySelector('.header');
  if (header) {
    let ticking = false;
    let isScrolled = false;

    const syncHeader = () => {
      const shouldBeScrolled = window.scrollY > 50;
      if (shouldBeScrolled !== isScrolled) {
        header.classList.toggle('header--scrolled', shouldBeScrolled);
        isScrolled = shouldBeScrolled;
      }
      ticking = false;
    };

    syncHeader();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(syncHeader);
      }
    }, { passive: true });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => i.classList.remove('open'));
        // Open clicked (toggle)
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.header__nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Smooth Number Counter Animation ---
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0) {
    if (prefersReducedMotion) {
      counters.forEach(el => {
        const target = el.getAttribute('data-counter');
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        el.textContent = prefix + target + suffix;
      });
    } else {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = el.getAttribute('data-counter');
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';

            // Parse target (handle % and x)
            const numericTarget = parseFloat(target);
            const duration = 2000;
            const start = performance.now();

            function update(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * numericTarget);
              el.textContent = prefix + current + suffix;
              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                el.textContent = prefix + target + suffix;
              }
            }

            requestAnimationFrame(update);
            counterObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(el => counterObserver.observe(el));
    }
  }

  // --- Contact Form Handling (static – just shows a thank you) ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sent! We\'ll be in touch.';
      btn.style.background = '#22c55e';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

});
