/* ==========================================================================
   UTILS.JS — Helpers visuales y de renderizado
   ========================================================================== */
import { Animations } from '../core/animations.js';

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderEmptyState({ icon, title, desc = '', ctaLabel = '', ctaClass = '', inline = false }) {
  return `
    <div class="empty-state${inline ? ' empty-state--inline' : ''}">
      <div class="empty-state__icon-wrap"><span class="empty-state__icon">${icon}</span></div>
      <p class="empty-state__title">${escapeHtml(title)}</p>
      ${desc ? `<p class="empty-state__desc">${escapeHtml(desc)}</p>` : ''}
      ${ctaLabel ? `<button type="button" class="btn btn-primary u-max-w-form empty-state__cta ${ctaClass}">${escapeHtml(ctaLabel)}</button>` : ''}
    </div>`;
}

export function initMicrointeractions() {
  const RIPPLE_SELECTOR = '.btn, .btn-fab, .btn-icon-round, .theme-toggle-btn, .select-card, .tabs__btn, .list-item__action-btn';

  document.addEventListener('click', (e) => {
    const target = e.target.closest(RIPPLE_SELECTOR);
    if (!target || target.disabled) return;
    Animations.spawnRipple(target, e);
  });
}