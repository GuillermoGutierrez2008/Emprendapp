/* ==========================================================================
   THEME.JS — Gestión del Modo Claro / Oscuro
   ========================================================================== */

const THEME_STORAGE_KEY = 'emprendapp_theme';

export function initTheme() {
  const root = document.documentElement;
  const toggleBtns = document.querySelectorAll('.js-theme-toggle');

  let saved = 'dark';
  try {
    saved = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  } catch (err) {
    console.warn('No se pudo leer la preferencia de tema.', err);
  }

  applyTheme(saved);

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggleBtns.forEach((btn) => {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    });
  }

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch (err) {
        console.warn('No se pudo guardar la preferencia de tema.', err);
      }
    });
  });
}