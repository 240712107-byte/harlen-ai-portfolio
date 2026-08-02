/* ============================================
   Harlen Wu — Shared JS
   Language Toggle · Nav · Particles · Reveal
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // Language Toggle
  // ============================================
  const LangManager = {
    current: 'zh',
    init() {
      const saved = localStorage.getItem('site-lang');
      if (saved) this.current = saved;
      this.apply();
      const toggle = document.querySelector('.lang-toggle');
      if (toggle) {
        toggle.addEventListener('click', () => this.toggle());
      }
    },
    apply() {
      document.documentElement.lang = this.current;
      this.updateToggle();
      localStorage.setItem('site-lang', this.current);
    },
    toggle() {
      this.current = this.current === 'zh' ? 'en' : 'zh';
      this.apply();
    },
    updateToggle() {
      const toggle = document.querySelector('.lang-toggle');
      if (!toggle) return;
      const cn = toggle.querySelector('.lang-cn');
      const en = toggle.querySelector('.lang-en');
      if (this.current === 'zh') {
        if (cn) cn.classList.add('lang-active');
        if (en) en.classList.remove('lang-active');
      } else {
        if (cn) cn.classList.remove('lang-active');
        if (en) en.classList.add('lang-active');
      }
    }
  };

  // ============================================
  // Navigation
  // ============================================
  const NavManager = {
    init() {
      const hamburger = document.querySelector('.hamburger');
      const navLinks = document.querySelector('.nav-links');
      const navbar = document.querySelector('.navbar');

      if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
          });
        });
      }

      // Scroll effect on navbar
      if (navbar) {
        let ticking = false;
        window.addEventListener('scroll', () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
              } else {
                navbar.classList.remove('scrolled');
              }
              ticking = false;
            });
            ticking = true;
          }
        });
      }

      // Set active nav link
      this.setActiveLink();
    },
    setActiveLink() {
      const path = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('.nav-links a');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === path || (path === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
    }
  };

  // ============================================
  // Particle Background (Lightweight Canvas)
  // ============================================
  const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    config: {
      count: 50,
      maxRadius: 2,
      speed: 0.3,
      connectionDistance: 120,
      colors: ['rgba(108, 182, 255, ', 'rgba(79, 209, 197, ']
    },
    init() {
      this.canvas = document.getElementById('particle-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.createParticles();
      this.animate();
      window.addEventListener('resize', () => {
        this.resize();
        this.createParticles();
      });
    },
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    createParticles() {
      const count = window.innerWidth < 768 ? 25 : this.config.count;
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * this.config.speed,
          vy: (Math.random() - 0.5) * this.config.speed,
          r: Math.random() * this.config.maxRadius + 0.5,
          opacity: Math.random() * 0.5 + 0.15,
          colorIdx: Math.random() > 0.5 ? 0 : 1
        });
      }
    },
    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const ps = this.particles;
      const dist = this.config.connectionDistance;
      const colorArr = this.config.colors;

      // Draw connections
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < dist) {
            const alpha = (1 - d / dist) * 0.12;
            this.ctx.strokeStyle = 'rgba(108, 182, 255, ' + alpha + ')';
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(ps[i].x, ps[i].y);
            this.ctx.lineTo(ps[j].x, ps[j].y);
            this.ctx.stroke();
          }
        }
      }

      // Draw & move particles
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;

        // Draw
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = colorArr[p.colorIdx] + p.opacity + ')';
        this.ctx.fill();
      }

      requestAnimationFrame(() => this.animate());
    }
  };

  // ============================================
  // Scroll Reveal
  // ============================================
  const RevealManager = {
    init() {
      const elements = document.querySelectorAll('.reveal');
      if (!elements.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      elements.forEach(el => observer.observe(el));
    }
  };

  // ============================================
  // Contact Form
  // ============================================
  const FormManager = {
    init() {
      const form = document.querySelector('.contact-form form');
      if (!form) return;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.form-submit');
        const lang = document.documentElement.lang;
        if (btn) {
          const original = btn.textContent;
          btn.textContent = lang === 'zh' ? '已提交，感谢！' : 'Submitted, thank you!';
          btn.style.background = 'linear-gradient(135deg, #4fd1c5, #6cb6ff)';
          setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
            form.reset();
          }, 2500);
        }
      });
    }
  };

  // ============================================
  // Init All
  // ============================================
  function init() {
    LangManager.init();
    NavManager.init();
    ParticleSystem.init();
    RevealManager.init();
    FormManager.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
