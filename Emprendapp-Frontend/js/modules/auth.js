/* ==========================================================================
   AUTH.JS — Dominio de Autenticación y Onboarding
   ========================================================================== */
import { AppState } from '../core/state.js';
import { Navigation } from '../core/navigation.js';
import { Animations } from '../core/animations.js';
import { validateRequired, validateEmail, validateMinLength, validatePasswordsMatch } from '../ui/validation.js';

export function initAuth() {
  initSplash();
  initLogin();
  initRecoverPassword();
  initRegister();
}

function initSplash() {
  const splash = document.getElementById('screen-splash');
  if (!splash) return;
  let hasNavigated = false;

  function goToLogin() {
    if (hasNavigated) return;
    hasNavigated = true;
    splash.classList.add('is-leaving');
    setTimeout(() => Navigation.goTo('login'), 480);
  }

  setTimeout(goToLogin, 2500);
  splash.addEventListener('click', goToLogin);
}

function initLogin() {
  const form = document.querySelector('.js-login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('.js-input-email');
    const passwordInput = form.querySelector('.js-input-password');

    if (!validateEmail(emailInput) || !validateRequired(passwordInput)) return;

    try {
      await AppState.login(emailInput.value.trim());
      Animations.showToast('¡Bienvenido/a de nuevo!');
      
      const target = AppState.data.user.rubro ? 'insumos' : 'rubro';
      setTimeout(() => Navigation.goTo(target), 400);
    } catch (error) {
      Animations.showToast('Error al iniciar sesión', 'error');
    }
  });
}

function initRecoverPassword() {
  // Lógica de recuperación extraída directamente de app.js original
  const recoverForm = document.querySelector('.js-recover-form');
  const otpModal = document.querySelector('.js-modal-otp');
  const otpCancelBtn = document.querySelector('.js-modal-otp-cancel');
  const otpConfirmBtn = document.querySelector('.js-modal-otp-confirm');
  
  recoverForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateEmail(recoverForm.querySelector('.js-input-email'))) return;
    Animations.openModal(otpModal);
  });

  otpCancelBtn?.addEventListener('click', () => Animations.closeModal(otpModal));
  otpConfirmBtn?.addEventListener('click', () => {
    Animations.closeModal(otpModal);
    Animations.showToast('Código verificado correctamente');
    Navigation.goTo('recover-reset');
  });
}

function initRegister() {
  const form = document.querySelector('.js-register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('.js-input-name');
    const emailInput = form.querySelector('.js-input-email');
    const passInput = form.querySelector('.js-input-password');
    const repeatInput = form.querySelector('.js-input-password-repeat');

    if (!validateRequired(nameInput) || !validateEmail(emailInput) || 
        !validateMinLength(passInput, 6) || !validatePasswordsMatch(passInput, repeatInput)) return;

    try {
      await AppState.registerUser({ name: nameInput.value.trim(), email: emailInput.value.trim() });
      Navigation.goTo('rubro');
    } catch (error) {
      Animations.showToast('Error en el registro', 'error');
    }
  });
}