"use strict";

/* -------------------------------------------------------------------------- */
/*                              Config                                        */
/* -------------------------------------------------------------------------- */
var CONFIG = {
  isNavbarVerticalCollapsed: false,
  theme: 'light',
  isRTL: false,
  isFluid: false,
  navbarStyle: 'transparent',
  navbarPosition: 'vertical'
};
Object.keys(CONFIG).forEach(function (key) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, CONFIG[key]);
  }
});
if (JSON.parse(localStorage.getItem('isNavbarVerticalCollapsed'))) {
  document.documentElement.classList.add('navbar-vertical-collapsed');
}
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.setAttribute('data-bs-theme', 'dark');
} else if (localStorage.getItem('theme') === 'auto') {
  document.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

// Ẩn các mục điều hướng theo cấu hình
document.addEventListener('DOMContentLoaded', function () {
  // 1. Ẩn toàn bộ nhóm Pages, Modules, Documentation trong vertical navbar
  var hideLabels = ['Pages', 'Modules', 'Documentation'];
  document.querySelectorAll('.navbar-vertical-label').forEach(function (label) {
    if (hideLabels.indexOf(label.textContent.trim()) !== -1) {
      var navItem = label.closest('.nav-item');
      if (navItem) {
        navItem.style.display = 'none';
      }
    }
  });

  // 2. Ẩn trên top navbar / double top / combo nav
  ['#pagess', '#moduless', '#documentations'].forEach(function (id) {
    document.querySelectorAll(id).forEach(function (el) {
      var navItem = el.closest('.nav-item');
      if (navItem) {
        navItem.style.display = 'none';
      }
    });
  });

  // 3. Trong nhóm App: Ẩn chat, email, events, elearning, kanban, social (cả vertical nav và navbar-card-app)
  var appSelectorsToHide = [
    'a[href*="chat.html"]',
    'a[href*="#email"]',
    '#email',
    'a[href*="/email/"]',
    'a[href*="#events"]',
    '#events',
    'a[href*="/events/"]',
    'a[href*="#e-learning"]',
    '#e-learning',
    'a[href*="/e-learning/"]',
    'a[href*="kanban.html"]',
    'a[href*="#social"]',
    '#social',
    'a[href*="/social/"]'
  ];
  appSelectorsToHide.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      if (el.closest('.navbar-vertical, .navbar-top, .navbar-standard')) {
        el.style.display = 'none';
      }
    });
  });

  // Ẩn tiêu đề mục con và cột E-learning/Events/Email trong mega-menu App ở top navbar
  var appHeadersToHide = ['Social', 'E-Learning', 'Events', 'Email'];
  document.querySelectorAll('.navbar-card-app p.nav-link').forEach(function (p) {
    if (appHeadersToHide.indexOf(p.textContent.trim()) !== -1) {
      p.style.display = 'none';
    }
  });
  document.querySelectorAll('.navbar-card-app .col-6, .navbar-card-app .col-md-4').forEach(function (col) {
    if (col.querySelector('a[href*="/e-learning/"]') && !col.querySelector('a[href*="calendar.html"]') && !col.querySelector('a[href*="/e-commerce/"]')) {
      col.style.display = 'none';
    }
  });

  // 4. Xóa/Ẩn card Purchase (Loving what you see?) trong navbar-vertical
  document.querySelectorAll('.navbar-vertical .settings').forEach(function (el) {
    el.remove();
  });
});