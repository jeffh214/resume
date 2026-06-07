(function () {
  'use strict';

  var body = document.body;
  var STORAGE_KEY = 'resumeJeffHallTheme';

  function syncMobileNav(open) {
    var toggle = document.getElementById('menu-toggle');
    var panel = document.getElementById('nav-mobile');
    if (!toggle || !panel) return;
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    body.classList.toggle('nav-open', open);
  }

  document.getElementById('menu-toggle')?.addEventListener('click', function () {
    var panel = document.getElementById('nav-mobile');
    var open = !panel?.classList.contains('is-open');
    syncMobileNav(open);
  });

  document.querySelectorAll('#nav-mobile a').forEach(function (link) {
    link.addEventListener('click', function () {
      syncMobileNav(false);
    });
  });

  window.addEventListener('resize', function () {
    if (window.matchMedia('(min-width: 960px)').matches) {
      syncMobileNav(false);
    }
  });

  function applySavedTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark') {
        body.setAttribute('data-theme', 'dark');
      } else if (saved === 'light') {
        body.removeAttribute('data-theme');
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
      }
    } catch (e) {
      /* ignore */
    }
  }

  function syncThemeLabel() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isDark = body.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    var label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    btn.setAttribute('aria-label', label);
    var txt = isDark ? 'Light' : 'Dark';
    var span = btn.querySelector('.theme-toggle-label');
    if (span) span.textContent = txt + ' mode';
  }

  document.getElementById('theme-toggle')?.addEventListener('click', function () {
    var isDark = body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      body.removeAttribute('data-theme');
      try {
        localStorage.setItem(STORAGE_KEY, 'light');
      } catch (e) {}
    } else {
      body.setAttribute('data-theme', 'dark');
      try {
        localStorage.setItem(STORAGE_KEY, 'dark');
      } catch (e) {}
    }
    syncThemeLabel();
  });

  function triggerPrintPdf() {
    if (/resume\.html$/i.test(window.location.pathname)) {
      var prevTitle = document.title;
      document.title = 'Jeff-Hall-Lead-QA-Engineer-Resume';
      window.print();
      setTimeout(function () {
        document.title = prevTitle;
      }, 400);
      return;
    }

    var resumePath = 'resume.html';
    try {
      var dir = window.location.pathname.replace(/[^/]*$/, '');
      if (dir) resumePath = dir + resumePath;
    } catch (e) {}

    var iframe = document.createElement('iframe');
    iframe.setAttribute('title', 'Resume print');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText =
      'position:fixed;left:-9999px;top:0;width:0;height:0;border:0;visibility:hidden';
    iframe.src = resumePath;

    function cleanup() {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }

    iframe.onload = function () {
      var doc = iframe.contentWindow;
      if (!doc) {
        cleanup();
        window.location.href = resumePath;
        return;
      }
      try {
        doc.document.title = 'Jeff-Hall-Lead-QA-Engineer-Resume';
      } catch (e) {}
      doc.focus();
      doc.print();
      doc.onafterprint = cleanup;
      setTimeout(cleanup, 2000);
    };

    iframe.onerror = function () {
      cleanup();
      window.open(resumePath, '_blank', 'noopener');
    };

    document.body.appendChild(iframe);
  }

  document.querySelectorAll('[data-print-resume]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      triggerPrintPdf();
    });
  });

  function startFocusRotator() {
    var el = document.getElementById('focus-rotator');
    if (!el) return;
    var items = [
      'Email QA & deliverability',
      'WCAG / ADA accessibility',
      'AI-assisted regression',
      'Release readiness & governance'
    ];
    var i = 0;
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    setInterval(function () {
      i = (i + 1) % items.length;
      el.style.opacity = '0';
      setTimeout(function () {
        el.textContent = items[i];
        el.style.opacity = '1';
      }, 220);
    }, 3200);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  applySavedTheme();
  syncThemeLabel();
  startFocusRotator();
})();
