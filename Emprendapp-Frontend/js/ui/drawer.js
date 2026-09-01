/* ==========================================================================
   DRAWER.JS — Lógica del Menú Lateral y Sesión
   ========================================================================== */
import { AppState } from '../core/state.js';
import { Navigation } from '../core/navigation.js';
import { Animations } from '../core/animations.js';

export function initDrawer() {
  const overlay = document.querySelector('.js-drawer-overlay');
  const hamburgerBtn = document.querySelector('.js-hamburger');
  const closeBtn = document.querySelector('.js-drawer-close');
  const drawerLinks = document.querySelectorAll('.js-drawer-link');

  function openDrawer() {
    overlay?.classList.add('is-open');
    hamburgerBtn?.classList.add('is-open');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    overlay?.classList.remove('is-open');
    hamburgerBtn?.classList.remove('is-open');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn?.addEventListener('click', () => {
    const isOpen = overlay?.classList.contains('is-open');
    isOpen ? closeDrawer() : openDrawer();
  });

  closeBtn?.addEventListener('click', closeDrawer);

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeDrawer();
  });

  drawerLinks.forEach((link) => link.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  document.querySelectorAll('.js-logout').forEach((btn) => {
    btn.addEventListener('click', async () => {
      closeDrawer();
      await logout();
    });
  });
}

async function logout() {
  // TODO: Reemplazar con fetch('/api/v1/logout', { method: 'POST' })
  AppState.data.user.isLoggedIn = false;
  await AppState.save();
  Navigation.goTo('login');
  Animations.showToast('Sesión cerrada correctamente');
}