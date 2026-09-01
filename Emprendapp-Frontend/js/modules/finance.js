/* ==========================================================================
   FINANCE.JS — Dominio de Costos y Cálculos de Rentabilidad
   ========================================================================== */
import { AppState } from '../core/state.js';
import { Animations, formatNumber } from '../core/animations.js';
import { validateRequired } from '../ui/validation.js';
import { escapeHtml, renderEmptyState } from '../ui/utils.js';

export function initFinance() {
  initCostos();
  initCalculos();
}

function initCostos() {
  const modal = document.querySelector('.js-modal-costo');
  const form = document.querySelector('.js-costo-form');
  const conceptoInput = document.querySelector('.js-costo-concepto');
  const categoriaInput = document.querySelector('.js-costo-categoria');
  const montoInput = document.querySelector('.js-costo-monto');
  let currentTipo = 'fijo';

  document.querySelectorAll('.js-open-costo-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentTipo = btn.getAttribute('data-tipo');
      form.reset();
      Animations.openModal(modal);
      conceptoInput.focus();
    });
  });

  document.querySelector('.js-modal-costo-cancel')?.addEventListener('click', () => Animations.closeModal(modal));

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateRequired(conceptoInput) || !validateRequired(montoInput)) return;

    try {
      await AppState.addCosto(currentTipo, {
        concepto: conceptoInput.value.trim(),
        categoria: categoriaInput.value,
        monto: Number(montoInput.value),
      });

      Animations.closeModal(modal);
      Animations.showToast(currentTipo === 'fijo' ? 'Costo fijo agregado' : 'Costo variable agregado');
      renderCostos();
    } catch (error) {
      Animations.showToast('Error al guardar el costo', 'error');
    }
  });

  // Delegación para eliminar (Fijos y Variables)
  document.querySelectorAll('.js-costos-fijos-list, .js-costos-variables-list').forEach((list) => {
    list.addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('.js-delete-costo');
      if (!deleteBtn) return;
      
      const id = deleteBtn.getAttribute('data-id');
      const tipo = deleteBtn.getAttribute('data-tipo');
      const itemEl = deleteBtn.closest('.list-item');
      
      await Animations.removeListItem(itemEl);
      await AppState.deleteCosto(tipo, id);
      Animations.showToast('Costo eliminado', 'error');
      renderCostos();
    });
  });
}

export function renderCostos() {
  // Lógica de renderizado idéntica a app.js
  renderCostosList('fijo');
  renderCostosList('variable');
  renderResumenFijos();
  renderDesglose();
}

function renderCostosList(tipo) {
  const list = document.querySelector(tipo === 'fijo' ? '.js-costos-fijos-list' : '.js-costos-variables-list');
  if (!list) return;
  const items = tipo === 'fijo' ? AppState.data.costosFijos : AppState.data.costosVariables;

  if (items.length === 0) {
    list.innerHTML = renderEmptyState({
      icon: '🧾',
      title: `Todavía no agregaste costos ${tipo === 'fijo' ? 'fijos' : 'variables'}`,
      ctaLabel: `+ Agregar primer costo ${tipo === 'fijo' ? 'fijo' : 'variable'}`,
      ctaClass: 'js-empty-add-costo',
    });
    return;
  }

  list.innerHTML = items.map((c) => `
    <div class="list-item" data-id="${c.id}">
      <div class="list-item__info">
        <div class="list-item__title">${escapeHtml(c.concepto)}</div>
      </div>
      <div class="list-item__price">$${formatNumber(c.monto)}</div>
      <div class="list-item__actions">
        <button class="list-item__action-btn list-item__action-btn--danger js-delete-costo" data-id="${c.id}" data-tipo="${tipo}">🗑️</button>
      </div>
    </div>
  `).join('');
}

async function renderResumenFijos() {
  const totalFijos = await AppState.getTotalCostosFijos();
  const totalEl = document.querySelector('.js-total-fijos');
  if (totalEl) totalEl.textContent = '$' + formatNumber(totalFijos);
}

async function renderDesglose() {
  const totalFijos = await AppState.getTotalCostosFijos();
  const totalVariables = await AppState.getTotalCostosVariables();
  document.querySelector('.js-desglose-total').textContent = '$' + formatNumber(totalFijos + totalVariables);
}

function initCalculos() {
  const slider = document.querySelector('.js-margen-slider');
  slider?.addEventListener('input', async () => {
    await AppState.setMargen(Number(slider.value));
    renderCalculos();
  });
}

export function renderCalculos() {
  const { calculos } = AppState.data;
  const slider = document.querySelector('.js-margen-slider');
  if (slider) slider.value = calculos.margen;
  
  const ganancia = Math.round(calculos.costoUnidad * (calculos.margen / 100));
  const precioSugerido = calculos.costoUnidad + ganancia;
  
  const precioEl = document.querySelector('.js-precio-sugerido');
  if (precioEl) precioEl.textContent = '$' + formatNumber(precioSugerido);
}