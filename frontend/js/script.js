/* ============================================
   BLIEVE — script.js
   Nav, Theme, Forms, Scroll
   ============================================ */
(function() {
  'use strict';

  // --- Theme Toggle ---
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('blieve-theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  }

  window.toggleTheme = function() {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('blieve-theme', next);
    updateThemeIcon(next);
  };

  function updateThemeIcon(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.innerHTML = theme === 'light'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  }
  document.addEventListener('DOMContentLoaded', function() {
    updateThemeIcon(root.getAttribute('data-theme') || 'dark');
  });

  // --- Nav Scroll ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Mobile Nav ---
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function() {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll Progress ---
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function() {
      var h = document.documentElement;
      var pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  // --- Active Nav Link ---
  document.addEventListener('DOMContentLoaded', function() {
    var path = window.location.pathname.replace(/\/$/, '');
    var filename = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === filename || (filename === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  });

  // --- Scroll Reveal ---
  document.addEventListener('DOMContentLoaded', function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
  });

  // --- Card Glow Effect ---
  document.addEventListener('DOMContentLoaded', function() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.card-glow').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  });

  // --- Loading Screen ---
  document.addEventListener('DOMContentLoaded', function() {
    var ls = document.querySelector('.loading-screen');
    if (!ls) return;
    if (sessionStorage.getItem('blieve-loaded')) {
      ls.remove();
      return;
    }
    ls.addEventListener('click', function() { hideLoading(); });
    setTimeout(hideLoading, 1200);
  });

  function hideLoading() {
    var ls = document.querySelector('.loading-screen');
    if (!ls || ls.classList.contains('hidden')) return;
    ls.classList.add('hidden');
    sessionStorage.setItem('blieve-loaded', '1');
    setTimeout(function() { ls.remove(); }, 500);
  }

  // --- Contact Form ---
  document.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('.contact-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('.form-submit');
      var original = btn.innerHTML;
      btn.innerHTML = '<span class="coming-soon-pulse">Sending...</span>';
      btn.disabled = true;
      setTimeout(function() {
        btn.innerHTML = '&#10003; Sent!';
        btn.style.background = '#22c55e';
        setTimeout(function() {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 2000);
      }, 1500);
    });
  });


})();
