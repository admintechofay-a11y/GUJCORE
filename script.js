/* ============================================================
   GUJCORR 2027 – JavaScript
   Interactions, Countdown, Animations, Navigation
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
    // Active nav link
    updateActiveNavLink();
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.scrollToTop = scrollToTop;

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ---- Active nav link on scroll ----
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  }

  // ---- Countdown Timer ----
  function updateCountdown() {
    const targetDate = new Date('2027-02-18T09:00:00+05:30');
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('cDays').textContent = '000';
      document.getElementById('cHours').textContent = '00';
      document.getElementById('cMins').textContent = '00';
      document.getElementById('cSecs').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cDays').textContent = String(days).padStart(3, '0');
    document.getElementById('cHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cMins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cSecs').textContent = String(secs).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---- Stats Counter Animation ----
  function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // ---- Intersection Observer for animations ----
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

  // Stats observer
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObserver.observe(statsSection);

  // Fade-in-up observer
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.session-card, .speaker-card, .sponsor-card, .committee-card, .org-card, .contact-card, .timeline-item, .about-info-card, .why-item, .reg-card').forEach((el, i) => {
    el.classList.add('fade-in-up');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    fadeObserver.observe(el);
  });

  // ---- Particles ----
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.width = `${Math.random() * 4 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      particle.style.opacity = `${Math.random() * 0.4 + 0.1}`;
      // Alternate colors
      particle.style.background = i % 3 === 0 ? '#14b8a6' : i % 3 === 1 ? '#0ea5e9' : '#a855f7';
      particleContainer.appendChild(particle);
    }
  }

  // ---- Registration Form ----
  window.submitRegistration = function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    // Simulate submission
    setTimeout(() => {
      document.getElementById('registrationForm').style.display = 'none';
      document.getElementById('formSuccess').style.display = 'flex';
    }, 1500);
  };

  // ---- Smooth scroll for all anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 80;
          const targetPosition = target.offsetTop - offset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  // ---- Session card interaction ----
  document.querySelectorAll('.session-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'rgba(14,165,233,0.5)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
    });
  });

  // ---- Initial page load animation ----
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

});
