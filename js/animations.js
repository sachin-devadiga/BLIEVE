/* ============================================
   BLIEVE — animations.js
   GSAP, Tilt, Magnetic, Cursor, Marquee, Spark
   ============================================ */
(function() {
  'use strict';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Tilt Cards (subtle, max 4 degrees) ---
  if (!reducedMotion && !window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('.portfolio-card .card-inner').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
      });
    });
  }

  // --- Magnetic Buttons ---
  if (!reducedMotion && !window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // --- Animated Nav Underline ---
  if (!reducedMotion) {
    document.addEventListener('DOMContentLoaded', function() {
      var navLinks = document.querySelector('.nav-links');
      if (!navLinks) return;
      var underline = document.createElement('div');
      underline.className = 'nav-underline';
      navLinks.appendChild(underline);
      var active = navLinks.querySelector('.active');
      if (active) { moveUnderline(active); }
      navLinks.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('mouseenter', function() { moveUnderline(link); });
        link.addEventListener('mouseleave', function() { if (active) moveUnderline(active); });
      });
      function moveUnderline(el) {
        underline.style.left = el.offsetLeft + 'px';
        underline.style.width = el.offsetWidth + 'px';
      }
    });
  }

  // --- GSAP Scroll Animations (if GSAP loaded) ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Spark SVG stroke draw
    document.querySelectorAll('.spark-path').forEach(function(path) {
      var len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: path, start: 'top 80%', once: true }
      });
    });

    // Stat number count up
    document.querySelectorAll('.stat-number[data-target]').forEach(function(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: function() { el.textContent = Math.floor(obj.val) + suffix; }
      });
    });

    // Timeline draw
    document.querySelectorAll('.timeline-item').forEach(function(item, i) {
      gsap.from(item, {
        opacity: 0,
        x: i % 2 === 0 ? -40 : 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 80%', once: true }
      });
    });

    // Portfolio card stagger
    gsap.utils.toArray('.portfolio-card').forEach(function(card, i) {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        delay: (i % 3) * 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true }
      });
    });
  }

  // --- Hero Headline Stagger ---
  if (!reducedMotion) {
    document.addEventListener('DOMContentLoaded', function() {
      var heroWords = document.querySelectorAll('.hero-word');
      if (heroWords.length === 0) return;
      heroWords.forEach(function(word, i) {
        word.style.opacity = '0';
        word.style.transform = 'translateY(20px)';
        word.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.08) + 's, transform 0.5s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.08) + 's';
        setTimeout(function() { word.style.opacity = '1'; word.style.transform = 'translateY(0)'; }, 100);
      });
    });
  }

})();
