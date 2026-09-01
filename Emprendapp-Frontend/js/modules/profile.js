/* ==========================================================================
   PROFILE.JS — Configuración de Perfil y Rubro
   ========================================================================== */
import { AppState } from '../core/state.js';
import { Navigation } from '../core/navigation.js';
import { Animations } from '../core/animations.js';
import { validateRequired, validateEmail } from '../ui/validation.js';

let justRegistered = false;

export function initProfile() {
  initRubro();
  initPerfilForm();
}

function initRubro() {
  const cards = document.querySelectorAll('.js-rubro-card');
  const confirmBtn = document.querySelector('.js-confirm-rubro');
  let selectedRubro = null;

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      cards.forEach((c) => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      selectedRubro = card.getAttribute('data-rubro');
      if (confirmBtn) confirmBtn.disabled = false;
    });
  });

  confirmBtn?.addEventListener('click', async () => {
    if (!selectedRubro) return;
    
    try {
      await AppState.setRubro(selectedRubro);
      Animations.showToast('¡Cuenta creada! Revisá tus datos.');
      
      justRegistered = true;
      setTimeout(() => Navigation.goTo('perfil'), 350);
    } catch (error) {
      Animations.showToast('Error al guardar el rubro', 'error');
    }
  });
}

function initPerfilForm() {
  const form = document.querySelector('.js-perfil-form');
  const editarBtn = document.querySelector('.js-perfil-editar');
  const nombreInput = document.querySelector('.js-perfil-nombre');
  const emailInput = document.querySelector('.js-perfil-email');
  const rubroInput = document.querySelector('.js-perfil-rubro');

  editarBtn?.addEventListener('click', () => {
    setPerfilEditMode(true);
    nombreInput?.focus();
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateRequired(nombreInput) || !validateEmail(emailInput)) return;

    try {
      await AppState.updateProfile({
        name: nombreInput.value.trim(),
        email: emailInput.value.trim(),
        rubro: rubroInput?.value,
      });

      setPerfilEditMode(false);
      Animations.showToast('Datos actualizados correctamente');
    } catch (error) {
      Animations.showToast('Error al actualizar el perfil', 'error');
    }
  });
}

function setPerfilEditMode(isEditing) {
  const editarBtn = document.querySelector('.js-perfil-editar');
  const guardarBtn = document.querySelector('.js-perfil-guardar');
  const inputs = document.querySelectorAll('.js-perfil-nombre, .js-perfil-email, .js-perfil-rubro');

  inputs.forEach((input) => (input.disabled = !isEditing));
  if (editarBtn) editarBtn.style.display = isEditing ? 'none' : '';
  if (guardarBtn) guardarBtn.style.display = isEditing ? '' : 'none';
}

export function renderPerfil() {
  const { user } = AppState.data;
  const nombreEl = document.querySelector('.js-perfil-nombre');
  const emailEl = document.querySelector('.js-perfil-email');
  const rubroEl = document.querySelector('.js-perfil-rubro');

  if (nombreEl) nombreEl.value = user.name || '';
  if (emailEl) emailEl.value = user.email || '';
  if (rubroEl && user.rubro) rubroEl.value = user.rubro;

  setPerfilEditMode(Boolean(justRegistered));
  if (justRegistered) justRegistered = false;
}