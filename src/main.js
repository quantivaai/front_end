/**
 * Quantiva - Platform Scripts & Interactions
 * Color Palette: #010736, #0D1C42, #22396F, #FCF1D0
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initStatsCounters();
  initScenarioComparisonLanding();
  initFaqAccordion();
  initContactForm();
  initNewsletterForm();
  initCookieBanner();
  initTestimonialCarousel();
  initSmoothScrolling();
  initActiveNavLinks();
});

/* ==========================================================================
   Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const nav = document.querySelector('.header-nav');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (mobileBtn && drawer) {
    mobileBtn.addEventListener('click', () => {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (drawerClose) {
      drawerClose.addEventListener('click', closeDrawer);
    }

    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        closeDrawer();
      }
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }
}

/* ==========================================================================
   Smooth Scrolling & Anchor Handling
   ========================================================================== */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const isHomeLink = href.startsWith('/#');
      const isDirectAnchor = href.startsWith('#');
      
      if (isDirectAnchor || (isHomeLink && window.location.pathname === '/')) {
        e.preventDefault();
        const targetId = isHomeLink ? href.substring(2) : href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const headerOffset = 80;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          
          // Update URL to show the active section hash
          history.pushState(null, null, '#' + targetId);
        }
      }
    });
  });

  if (window.location.hash) {
    setTimeout(() => {
      const targetId = window.location.hash.substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }, 100);
  }
}

/* ==========================================================================
   Active Navigation Link Highlighting
   ========================================================================== */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Update URL hash
        const id = entry.target.getAttribute('id');
        if (id === 'hero') {
          history.replaceState(null, null, window.location.pathname);
        } else {
          history.replaceState(null, null, '#' + id);
        }

        // Highlight active link
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id || link.getAttribute('href') === '/#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.2, // Trigger when 20% of section is visible
    rootMargin: '-80px 0px -40% 0px' // Offset for fixed header
  });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   Scroll-Triggered Reveals
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.fade-up, .slide-left, .slide-right');
  
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Animated Number Counters in Stats Band
   ========================================================================== */
function initStatsCounters() {
  const statElements = document.querySelectorAll('.stat-counter');
  if (!statElements.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    statElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = (easeProgress * target).toFixed(target % 1 === 0 ? 0 : 1);
        
        el.textContent = `${prefix}${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.25 });

  const statsBand = document.getElementById('stats-band');
  if (statsBand) {
    observer.observe(statsBand);
  }
}

/* ==========================================================================
   Scenario Comparison Graphic (Landing Page)
   ========================================================================== */
function initScenarioComparisonLanding() {
  const toggles = document.querySelectorAll('.scenario-toggle-btn');
  const scenarioData = {
    A: {
      title: 'Baseline Projection',
      desc: 'Standard continuation based on 24-month historical trend line without supply disruption adjustments.',
      metric1: '$42.8M',
      label1: 'Projected Net Return',
      metric2: '14.2%',
      label2: 'Capital Volatility Buffer',
      metric3: '98.1%',
      label3: 'SLA Confidence Rate',
      bars: [
        { label: 'Demand Fill', value: 82 },
        { label: 'Capacity Utilization', value: 74 },
        { label: 'Cost Efficiency', value: 68 },
        { label: 'Risk Protection', value: 70 }
      ]
    },
    B: {
      title: 'Aggressive Expansion Scenario',
      desc: 'High-growth capital allocation with elevated inventory throughput and optimized peak power contracts.',
      metric1: '$58.4M',
      label1: 'Projected Net Return',
      metric2: '21.5%',
      label2: 'Capital Volatility Buffer',
      metric3: '94.6%',
      label3: 'SLA Confidence Rate',
      bars: [
        { label: 'Demand Fill', value: 96 },
        { label: 'Capacity Utilization', value: 91 },
        { label: 'Cost Efficiency', value: 78 },
        { label: 'Risk Protection', value: 62 }
      ]
    },
    C: {
      title: 'Risk-Constrained Defense',
      desc: 'Rigid objective optimization bounded by maximum safety stock and strict energy tariff caps.',
      metric1: '$49.1M',
      label1: 'Projected Net Return',
      metric2: '8.4%',
      label2: 'Capital Volatility Buffer',
      metric3: '99.7%',
      label3: 'SLA Confidence Rate',
      bars: [
        { label: 'Demand Fill', value: 88 },
        { label: 'Capacity Utilization', value: 83 },
        { label: 'Cost Efficiency', value: 94 },
        { label: 'Risk Protection', value: 97 }
      ]
    }
  };

  const titleEl = document.getElementById('scenarioTitle');
  const descEl = document.getElementById('scenarioDesc');
  const m1El = document.getElementById('scMetric1');
  const m2El = document.getElementById('scMetric2');
  const m3El = document.getElementById('scMetric3');
  const barsContainer = document.getElementById('scenarioBars');

  if (!toggles.length || !barsContainer) return;

  const renderScenario = (key) => {
    const data = scenarioData[key];
    if (!data) return;

    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (m1El) m1El.textContent = data.metric1;
    if (m2El) m2El.textContent = data.metric2;
    if (m3El) m3El.textContent = data.metric3;

    barsContainer.innerHTML = '';
    data.bars.forEach((bar, index) => {
      const barItem = document.createElement('div');
      barItem.className = 'bar-metric-row';
      barItem.innerHTML = `
        <div class="bar-metric-info">
          <span>${bar.label}</span>
          <span class="font-mono">${bar.value}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: 0%;" data-final="${bar.value}%"></div>
        </div>
      `;
      barsContainer.appendChild(barItem);
      
      // Animate width
      setTimeout(() => {
        const fill = barItem.querySelector('.bar-fill');
        if (fill) fill.style.width = `${bar.value}%`;
      }, 50 + index * 40);
    });
  };

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      toggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scKey = btn.getAttribute('data-scenario');
      renderScenario(scKey);
    });
  });

  // Initial render
  renderScenario('A');
}


/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close others for clean accordion experience
      items.forEach(other => {
        other.classList.remove('active');
        const btn = other.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   Contact Form Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successState = document.getElementById('contactSuccess');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = btn ? btn.innerHTML : 'Submit Inquiry';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"/>
        </svg>
        Transmitting...
      `;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/maeqbvoj", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        form.style.display = 'none';
        if (successState) {
          successState.style.display = 'block';
          successState.classList.add('fade-up', 'in-view');
        }
      } else {
        const data = await response.json();
        if (Object.hasOwn(data, 'errors')) {
          alert(data.errors.map(error => error.message).join(", "));
        } else {
          alert("Oops! There was a problem submitting your form");
        }
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalBtnHTML;
        }
      }
    } catch (error) {
      alert("Oops! There was a problem submitting your form");
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnHTML;
      }
    }
  });
}

/* ==========================================================================
   Newsletter Subscription
   ========================================================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('newsletterEmail');
  const btn = document.getElementById('newsletterBtn');

  if (!form || !btn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!input || !input.value) return;

    btn.disabled = true;
    btn.innerHTML = `<span>Subscribing...</span>`;
    
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xyekpown", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        btn.innerHTML = `<span>Subscribed ✓</span>`;
        btn.style.backgroundColor = 'var(--color-primary)';
        btn.style.color = 'var(--color-accent)';
        btn.style.borderColor = 'var(--color-accent)';
        input.value = '';
        input.placeholder = 'Thank you for subscribing to Field Notes!';

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = `<span>Subscribe</span>`;
          btn.style.backgroundColor = '';
          btn.style.color = '';
          btn.style.borderColor = '';
          input.placeholder = 'Enter your work email';
        }, 5000);
      } else {
        alert("Oops! There was a problem subscribing.");
        btn.disabled = false;
        btn.innerHTML = `<span>Subscribe</span>`;
      }
    } catch (error) {
      alert("Oops! There was a problem subscribing.");
      btn.disabled = false;
      btn.innerHTML = `<span>Subscribe</span>`;
    }
  });
}

/* ==========================================================================
   Cookie Consent Banner
   ========================================================================== */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAccept');
  const declineBtn = document.getElementById('cookieDecline');

  if (!banner) return;

  const consentGiven = localStorage.getItem('quantiva_cookie_consent');

  if (!consentGiven) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 1200);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('quantiva_cookie_consent', 'accepted');
      banner.classList.remove('show');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('quantiva_cookie_consent', 'declined');
      banner.classList.remove('show');
    });
  }
}

/* ==========================================================================
   Testimonial Carousel (Mobile & Auto-Rotator indicator)
   ========================================================================== */
function initTestimonialCarousel() {
  const cards = document.querySelectorAll('.testimonial-card');
  if (cards.length < 2) return;

  let currentIndex = 0;
  const isMobile = window.innerWidth < 820;

  if (isMobile) {
    // Show one at a time on mobile carousel
    const showCard = (index) => {
      cards.forEach((c, i) => {
        c.style.display = i === index ? 'block' : 'none';
      });
    };
    showCard(0);

    setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      showCard(currentIndex);
    }, 6000);
  }
}
