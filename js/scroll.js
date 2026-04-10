/* ============================================
   스크롤 기반 애니메이션 & 키보드 네비게이션
   ============================================ */

(function () {
  'use strict';

  // --- 스크롤 트리거 애니메이션 ---
  const animateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('[data-animate], [data-stagger]').forEach((el) => {
    animateObserver.observe(el);
  });

  // --- 사이드 네비게이션 활성 상태 ---
  const navDots = document.querySelectorAll('.nav-dot');
  const navSections = [];

  navDots.forEach((dot) => {
    const href = dot.getAttribute('href');
    if (href) {
      const section = document.querySelector(href);
      if (section) navSections.push({ el: section, dot });
    }
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const match = navSections.find((s) => s.el === entry.target);
          if (match) {
            navDots.forEach((d) => d.classList.remove('active'));
            match.dot.classList.add('active');
          }
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-10% 0px -10% 0px',
    }
  );

  navSections.forEach((s) => navObserver.observe(s.el));

  // --- 키보드 네비게이션 ---
  const allSections = Array.from(document.querySelectorAll('section'));
  let currentIndex = 0;
  let isScrolling = false;

  // 현재 보이는 섹션 추적
  const keynavObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = allSections.indexOf(entry.target);
          if (idx !== -1) currentIndex = idx;
        }
      });
    },
    { threshold: 0.5 }
  );

  allSections.forEach((s) => keynavObserver.observe(s));

  function scrollToSection(index) {
    if (index < 0 || index >= allSections.length || isScrolling) return;
    isScrolling = true;
    currentIndex = index;
    allSections[index].scrollIntoView({ behavior: 'smooth' });
    // 스크롤 완료 후 잠금 해제
    setTimeout(() => { isScrolling = false; }, 600);
  }

  document.addEventListener('keydown', (e) => {
    // input, textarea 등에서는 무시
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        scrollToSection(currentIndex + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        scrollToSection(currentIndex - 1);
        break;
      case ' ':
        e.preventDefault();
        scrollToSection(currentIndex + 1);
        break;
      case 'Home':
        e.preventDefault();
        scrollToSection(0);
        break;
      case 'End':
        e.preventDefault();
        scrollToSection(allSections.length - 1);
        break;
    }
  });

  // --- 스크롤 안내 숨김 ---
  const scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    let hidden = false;
    window.addEventListener('scroll', () => {
      if (!hidden && window.scrollY > 100) {
        scrollCue.style.opacity = '0';
        scrollCue.style.transition = 'opacity 0.6s ease';
        hidden = true;
      }
    }, { passive: true });
  }

  // --- 키보드 힌트 자동 숨김 ---
  const keyboardHint = document.querySelector('.keyboard-hint');
  if (keyboardHint) {
    setTimeout(() => {
      keyboardHint.style.opacity = '0';
    }, 6000);
  }
})();
