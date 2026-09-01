/* ==========================================================================
   VALIDATION.JS — Validaciones de formularios
   ========================================================================== */

export function showFieldError(input, show) {
  const errorEl = input.closest('.field')?.querySelector('.field__error');
  input.classList.toggle('field__input--invalid', show);
  if (errorEl) errorEl.classList.toggle('is-visible', show);
  return !show;
}

export function validateRequired(input) {
  const ok = input.value.trim().length > 0;
  return showFieldError(input, !ok);
}

export function validateEmail(input) {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  return showFieldError(input, !ok);
}

export function validateMinLength(input, min) {
  const ok = input.value.trim().length >= min;
  return showFieldError(input, !ok);
}

export function validatePasswordsMatch(passInput, repeatInput) {
  const ok = passInput.value === repeatInput.value && repeatInput.value.length > 0;
  return showFieldError(repeatInput, !ok);
}