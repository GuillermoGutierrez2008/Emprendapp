/* ==========================================================================
   INVENTORY.JS — Dominio de Insumos
   ========================================================================== */
import { AppState } from '../core/state.js';
import { Animations, formatNumber } from '../core/animations.js';
import { validateRequired } from '../ui/validation.js';
import { escapeHtml, renderEmptyState } from '../ui/utils.js';

let editingId = null; 

/**
 * Inicializa los listeners de eventos para la pantalla de insumos.
 * Se ejecuta una sola vez al cargar la aplicación.
 */
export function initInventory() {
  const modal = document.querySelector('.js-modal-insumo');
  const modalTitle = document.querySelector('.js-modal-insumo-title');
  const form = document.querySelector('.js-insumo-form');
  const nombreInput = document.querySelector('.js-insumo-nombre');
  const precioInput = document.querySelector('.js-insumo-precio');
  const openBtn = document.querySelector('.js-open-insumo-modal');
  const cancelBtn = document.querySelector('.js-modal-insumo-cancel');
  const searchInput = document.querySelector('.js-search-insumo');
  const listContainer = document.querySelector('.js-insumos-list');

  openBtn?.addEventListener('click', () => {
    editingId = null;
    if (modalTitle) modalTitle.textContent = 'Nuevo insumo';
    form?.reset();
    Animations.openModal(modal);
    nombreInput?.focus();
  });

  cancelBtn?.addEventListener('click', () => Animations.closeModal(modal));

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateRequired(nombreInput) || !validateRequired(precioInput)) return;

    const nombre = nombreInput.value.trim();
    const precio = Number(precioInput.value);

    try {
      if (editingId) {
        await AppState.updateInsumo(editingId, { nombre, precio });
        Animations.showToast('Insumo actualizado');
      } else {
        await AppState.addInsumo({ nombre, precio });
        Animations.showToast('Insumo agregado');
      }
      
      Animations.closeModal(modal);
      // Al agregar o editar, volvemos a renderizar con la memoria local actualizada
      renderInsumos(searchInput?.value);
    } catch (error) {
      Animations.showToast('Error al guardar el insumo', 'error');
    }
  });

  // El buscador filtra en tiempo real sin llamar a PHP cada vez que tocás una tecla
  searchInput?.addEventListener('input', (e) => renderInsumos(e.target.value));

  // Delegación de eventos para la lista
  listContainer?.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.js-edit-insumo');
    const deleteBtn = e.target.closest('.js-delete-insumo');
    const emptyAddBtn = e.target.closest('.js-empty-add-insumo');

    if (emptyAddBtn) return openBtn?.click();

    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      const insumo = AppState.data.insumos.find((i) => i.id === id);
      if (!insumo) return;
      
      editingId = id;
      if (modalTitle) modalTitle.textContent = 'Editar insumo';
      if (nombreInput) nombreInput.value = insumo.nombre;
      if (precioInput) precioInput.value = insumo.precio;
      Animations.openModal(modal);
      nombreInput?.focus();
    }

    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      const itemEl = deleteBtn.closest('.list-item');
      
      await Animations.removeListItem(itemEl);
      try {
        await AppState.deleteInsumo(id);
        Animations.showToast('Insumo eliminado', 'error');
        if (AppState.data.insumos.length === 0) renderInsumos();
      } catch (error) {
        Animations.showToast('Error al eliminar', 'error');
      }
    }
  });
}

/**
 * FUNCIÓN NUEVA: Conecta la base de datos con la vista.
 * Llamá a esta función desde tu router (navigation.js) cuando cargue la pantalla.
 */
export async function inicializarPantallaInsumos() {
  // 1. Buscamos los datos reales en MySQL a través de PHP
  await AppState.cargarInsumos();
  
  // 2. Una vez que llegaron los datos, los dibujamos
  renderInsumos();
}

/**
 * Renderiza la lista de insumos en el DOM.
 * @param {string} filter - Texto para filtrar la búsqueda.
 */
export function renderInsumos(filter = '') {
  const list = document.querySelector('.js-insumos-list');
  if (!list) return;

  const term = filter.trim().toLowerCase();
  const items = AppState.data.insumos.filter((i) => i.nombre.toLowerCase().includes(term));

  if (items.length === 0) {
    list.innerHTML = AppState.data.insumos.length === 0
      ? renderEmptyState({
          icon: '📦',
          title: 'No tenés insumos agregados todavía',
          desc: 'Cargá tus materiales y precios para empezar a calcular tus costos.',
          ctaLabel: '+ Agregar primer insumo',
          ctaClass: 'js-empty-add-insumo',
        })
      : renderEmptyState({
          icon: '🔍',
          title: 'No se encontraron insumos',
          desc: `Ningún resultado para "${filter.trim()}".`,
        });
    return;
  }

  list.innerHTML = items.map((i) => `
    <div class="list-item" data-id="${i.id}">
      <div class="list-item__info">
        <div class="list-item__title">${escapeHtml(i.nombre)}</div>
      </div>
      <div class="list-item__price">$${formatNumber(i.precio)}</div>
      <div class="list-item__actions">
        <button class="list-item__action-btn js-edit-insumo" data-id="${i.id}" aria-label="Editar">✏️</button>
        <button class="list-item__action-btn list-item__action-btn--danger js-delete-insumo" data-id="${i.id}" aria-label="Eliminar">🗑️</button>
      </div>
    </div>
  `).join('');
}