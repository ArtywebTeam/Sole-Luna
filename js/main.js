/**
 * Sole Luna - Vanilla JS Main Application Logic
 * Manages Themes, i18n Translations, Sticky Header, Mobile Drawer, and Interactions
 */

(function () {
  'use strict';

  // State
  let currentLang = localStorage.getItem('sole_luna_lang') || 'it';
  let currentTheme = localStorage.getItem('sole_luna_theme');

  if (!currentTheme) {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = 'dark';
    } else {
      currentTheme = 'light';
    }
  }

  // DOM Elements
  const htmlRoot = document.documentElement;
  const siteHeader = document.getElementById('site-header');
  const btnTheme = document.getElementById('btn-theme');
  const btnLang = document.getElementById('btn-lang');
  const btnBurger = document.getElementById('btn-burger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const copyrightYear = document.getElementById('copyright-year');

  /* --------------------------------------------------------------------------
     1. THEME TOGGLER
     -------------------------------------------------------------------------- */
  function applyTheme(theme) {
    currentTheme = theme;
    if (theme === 'dark') {
      htmlRoot.classList.add('dark');
    } else {
      htmlRoot.classList.remove('dark');
    }
    localStorage.setItem('sole_luna_theme', theme);
    updateThemeButton();
  }

  function updateThemeButton() {
    if (!btnTheme) return;
    const t = translations[currentLang]?.common || {};
    if (currentTheme === 'dark') {
      btnTheme.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: hsl(var(--accent));">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      `;
      btnTheme.setAttribute('aria-label', t.themeLightAria || 'Activate light mode');
    } else {
      btnTheme.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      `;
      btnTheme.setAttribute('aria-label', t.themeDarkAria || 'Attiva modalità notturna');
    }
  }

  function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  /* --------------------------------------------------------------------------
     2. LANGUAGE TRANSLATIONS (i18n)
     -------------------------------------------------------------------------- */
  function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
  }

  function applyLanguage(lang) {
    if (!translations[lang]) lang = 'it';
    currentLang = lang;
    htmlRoot.setAttribute('lang', lang);
    localStorage.setItem('sole_luna_lang', lang);

    // Update text elements with data-i18n
    const translatables = document.querySelectorAll('[data-i18n]');
    translatables.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedTranslation(translations[lang], key);
      if (val !== null && val !== undefined) {
        el.textContent = val;
      }
    });

    // Update aria labels with data-i18n-aria
    const translatableArias = document.querySelectorAll('[data-i18n-aria]');
    translatableArias.forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      const val = getNestedTranslation(translations[lang], key);
      if (val !== null && val !== undefined) {
        el.setAttribute('aria-label', val);
      }
    });

    // Update button display
    if (btnLang) {
      btnLang.textContent = lang === 'it' ? 'ITA' : 'ENG';
      const common = translations[lang]?.common || {};
      btnLang.setAttribute('aria-label', common.langSwitchAria || 'Switch language');
    }

    updateThemeButton();
  }

  function toggleLanguage() {
    applyLanguage(currentLang === 'it' ? 'en' : 'it');
  }

  /* --------------------------------------------------------------------------
     3. HEADER SCROLL & MOBILE MENU
     -------------------------------------------------------------------------- */
  function handleScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  function toggleMobileMenu() {
    if (!mobileDrawer || !btnBurger) return;
    const isOpen = mobileDrawer.classList.toggle('open');
    if (isOpen) {
      btnBurger.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      `;
    } else {
      btnBurger.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
      `;
    }
  }

  function closeMobileMenu() {
    if (!mobileDrawer || !btnBurger) return;
    mobileDrawer.classList.remove('open');
    btnBurger.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" x2="20" y1="12" y2="12"></line>
        <line x1="4" x2="20" y1="6" y2="6"></line>
        <line x1="4" x2="20" y1="18" y2="18"></line>
      </svg>
    `;
  }

  /* --------------------------------------------------------------------------
     4. INITIALIZATION & EVENT LISTENERS
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // Initial Theme & Language
    applyTheme(currentTheme);
    applyLanguage(currentLang);

    // Dynamic Year
    if (copyrightYear) {
      copyrightYear.textContent = new Date().getFullYear();
    }

    // Scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Event listeners
    if (btnTheme) btnTheme.addEventListener('click', toggleTheme);
    if (btnLang) btnLang.addEventListener('click', toggleLanguage);
    if (btnBurger) btnBurger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a mobile link is clicked
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-btn-call');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  });

})();
