(function () {
  const body = document.body;
  const revealItems = document.querySelectorAll('.reveal');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main section[id]');
  const themeToggle = document.getElementById('themeToggle');
  const downloadPdf = document.getElementById('downloadPdf');
  const downloadPdfHero = document.getElementById('downloadPdfHero');
  const printResume = document.getElementById('printResume');
  const topButton = document.getElementById('topButton');
  const focusRotator = document.getElementById('focusRotator');
  const yearsExp = document.getElementById('yearsExp');
  const roleCards = document.querySelectorAll('.role');
  const showAllRoles = document.getElementById('showAllRoles');
  const showRecentRoles = document.getElementById('showRecentRoles');
  const statNumbers = document.querySelectorAll('.count-up');
  const savedTheme = localStorage.getItem('resumeTheme');

  if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
  } else if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.setAttribute('data-theme', 'dark');
  }

  function syncThemeButton() {
    if (!themeToggle) {
      return;
    }
    const isDark = body.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }

  syncThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isDark = body.getAttribute('data-theme') === 'dark';
      if (isDark) {
        body.removeAttribute('data-theme');
        localStorage.setItem('resumeTheme', 'light');
      } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('resumeTheme', 'dark');
      }
      syncThemeButton();
    });
  }

  function triggerPdfDownload() {
    const previousTitle = document.title;
    document.title = 'Jeff-Hall-Resume';
    window.print();
    setTimeout(function () {
      document.title = previousTitle;
    }, 350);
  }

  if (downloadPdf) {
    downloadPdf.addEventListener('click', triggerPdfDownload);
  }

  if (downloadPdfHero) {
    downloadPdfHero.addEventListener('click', triggerPdfDownload);
  }

  if (printResume) {
    printResume.addEventListener('click', function () {
      window.print();
    });
  }

  if (focusRotator) {
    const focusItems = ['Email QA', 'Accessibility QA', 'AI-Assisted Testing', 'Backend Validation'];
    let focusIndex = 0;
    setInterval(function () {
      focusIndex = (focusIndex + 1) % focusItems.length;
      focusRotator.textContent = focusItems[focusIndex];
    }, 2200);
  }

  if (yearsExp) {
    const years = new Date().getFullYear() - 2004;
    yearsExp.textContent = years + '+';
  }

  function animateCount(el) {
    const target = Number(el.getAttribute('data-target') || '0');
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function setRoleFilter(mode) {
    roleCards.forEach(function (card) {
      const isRecent = card.getAttribute('data-era') === 'recent';
      const shouldHide = mode === 'recent' && !isRecent;
      card.classList.toggle('is-hidden', shouldHide);
    });

    if (showAllRoles) {
      showAllRoles.classList.toggle('active-filter', mode === 'all');
    }
    if (showRecentRoles) {
      showRecentRoles.classList.toggle('active-filter', mode === 'recent');
    }
  }

  if (showAllRoles) {
    showAllRoles.addEventListener('click', function () {
      setRoleFilter('all');
    });
  }

  if (showRecentRoles) {
    showRecentRoles.addEventListener('click', function () {
      setRoleFilter('recent');
    });
  }

  if (topButton) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        topButton.classList.add('show');
      } else {
        topButton.classList.remove('show');
      }
    });

    topButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (entry.target.id === 'summary') {
              statNumbers.forEach(function (stat) {
                if (!stat.dataset.animated) {
                  stat.dataset.animated = 'true';
                  animateCount(stat);
                }
              });
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });

    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const id = entry.target.getAttribute('id');
          const link = document.querySelector('.nav-links a[href="#' + id + '"]');
          if (!link || !entry.isIntersecting) {
            return;
          }
          navLinks.forEach(function (navLink) {
            navLink.classList.remove('active');
          });
          link.classList.add('active');
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('in-view');
    });
    statNumbers.forEach(function (stat) {
      animateCount(stat);
    });
  }
})();
