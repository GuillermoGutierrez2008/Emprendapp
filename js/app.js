/* ==========================================================================
   APP.JS — Lógica principal e interactividad de EmprendApp
   --------------------------------------------------------------------------
   Punto de entrada de la aplicación. Conecta el estado (state.js), la
   navegación (navigation.js) y las animaciones (animations.js) con cada
   pantalla. Organizado por pantalla para facilitar el mantenimiento.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  AppState.load();
  Navigation.bindGotoLinks();
  initTheme();
  initMicrointeractions();

  initSplash();
  initLogin();
  initRecoverPassword();
  initRegister();
  initRubro();
  initInsumos();
  initCostos();
  initCalculos();
  initEstadisticas();
  initPerfil();
  initDrawer();

  // Refresca los datos dinámicos de cada pantalla justo antes de mostrarla
  document.addEventListener('screen:before-show', (e) => {
    if (e.detail.screen === 'insumos') renderInsumos();
    if (e.detail.screen === 'costos') renderCostos();
    if (e.detail.screen === 'calculos') renderCalculos();
    if (e.detail.screen === 'estadisticas') renderEstadisticas();
    if (e.detail.screen === 'perfil') renderPerfil();
  });
});

/* ========================================================================
 * MENÚ LATERAL (DRAWER) — hamburguesa, cierre por X / backdrop / enlace
 * ===================================================================== */
function initDrawer() {
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

  // Cierra al hacer clic fuera del panel (sobre el backdrop semitransparente)
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeDrawer();
  });

  // Cierra el drawer al navegar a cualquier sección desde sus enlaces
  drawerLinks.forEach((link) => link.addEventListener('click', closeDrawer));

  // Cierra con la tecla Escape, por accesibilidad
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Conecta todos los botones de "Cerrar sesión" (drawer y pantalla de Perfil)
  document.querySelectorAll('.js-logout').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeDrawer();
      logout();
    });
  });
}

/**
 * Cierra la sesión simulada: limpia el flag de login en el estado y
 * vuelve a la pantalla de Login. Se usa desde el botón del drawer y
 * desde el botón de la pantalla de Perfil.
 */
function logout() {
  // TODO: Reemplazar con fetch('/api/v1/logout', { method: 'POST' })
  AppState.data.user.isLoggedIn = false;
  AppState.save();
  Navigation.goTo('login');
  Animations.showToast('Sesión cerrada correctamente');
}

/* ========================================================================
 * 1. SPLASH SCREEN
 * ===================================================================== */
function initSplash() {
  const splash = document.getElementById('screen-splash');
  let hasNavigated = false;

  function goToLogin() {
    if (hasNavigated) return;
    hasNavigated = true;
    splash.classList.add('is-leaving');
    setTimeout(() => Navigation.goTo('login'), 480);
  }

  // Navega automáticamente luego de 2.5s
  setTimeout(goToLogin, 2500);
  // O al hacer clic/touch en cualquier parte de la pantalla
  splash.addEventListener('click', goToLogin);
}

/* ========================================================================
 * 2. LOGIN
 * ===================================================================== */
function initLogin() {
  const form = document.querySelector('.js-login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('.js-input-email');
    const passwordInput = form.querySelector('.js-input-password');

    const emailOk = validateEmail(emailInput);
    const passwordOk = validateRequired(passwordInput);

    if (!emailOk || !passwordOk) return;

    // TODO: Reemplazar con fetch('/api/v1/login', { method: 'POST', body: {...} })
    AppState.login(emailInput.value.trim());
    Animations.showToast('¡Bienvenido/a de nuevo!');

    // Si el usuario ya tiene un rubro elegido, va directo a Insumos.
    // Si es su primera vez, lo llevamos al flujo de onboarding (rubro).
    const target = AppState.data.user.rubro ? 'insumos' : 'rubro';
    setTimeout(() => Navigation.goTo(target), 400);
  });
}

/* ========================================================================
 * 3 y 4. RECUPERAR CONTRASEÑA (solicitar código + restablecer)
 * ===================================================================== */
function initRecoverPassword() {
  const recoverForm = document.querySelector('.js-recover-form');
  const otpModal = document.querySelector('.js-modal-otp');
  const otpCancelBtn = document.querySelector('.js-modal-otp-cancel');
  const otpConfirmBtn = document.querySelector('.js-modal-otp-confirm');
  const otpInputs = document.querySelectorAll('.otp-group__input');
  const resetForm = document.querySelector('.js-reset-form');

  if (recoverForm) {
    recoverForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = recoverForm.querySelector('.js-input-email');
      if (!validateEmail(emailInput)) return;

      // TODO: Reemplazar con fetch('/api/v1/recover/request-code', { method: 'POST', body: {...} })
      Animations.openModal(otpModal);
      otpInputs.forEach((i) => (i.value = ''));
      otpInputs[0]?.focus();
    });
  }

  // Auto-avanza el foco al siguiente input de OTP
  otpInputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      if (input.value && idx < otpInputs.length - 1) {
        otpInputs[idx + 1].focus();
      }
    });
  });

  otpCancelBtn?.addEventListener('click', () => Animations.closeModal(otpModal));

  otpConfirmBtn?.addEventListener('click', () => {
    // TODO: Reemplazar con fetch('/api/v1/recover/verify-code', { method: 'POST', body: {...} })
    Animations.closeModal(otpModal);
    Animations.showToast('Código verificado correctamente');
    Navigation.goTo('recover-reset');
  });

  if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const passInput = resetForm.querySelector('.js-input-password');
      const repeatInput = resetForm.querySelector('.js-input-password-repeat');

      const passOk = validateMinLength(passInput, 6);
      const matchOk = validatePasswordsMatch(passInput, repeatInput);
      if (!passOk || !matchOk) return;

      // TODO: Reemplazar con fetch('/api/v1/recover/reset', { method: 'POST', body: {...} })
      Animations.showToast('Contraseña actualizada con éxito');
      resetForm.reset();
      setTimeout(() => Navigation.goTo('login'), 400);
    });
  }
}

/* ========================================================================
 * 5. REGISTRO — DATOS PERSONALES
 * ===================================================================== */
function initRegister() {
  const form = document.querySelector('.js-register-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('.js-input-name');
    const emailInput = form.querySelector('.js-input-email');
    const passInput = form.querySelector('.js-input-password');
    const repeatInput = form.querySelector('.js-input-password-repeat');

    const nameOk = validateRequired(nameInput);
    const emailOk = validateEmail(emailInput);
    const passOk = validateMinLength(passInput, 6);
    const matchOk = validatePasswordsMatch(passInput, repeatInput);

    if (!nameOk || !emailOk || !passOk || !matchOk) return;

    // TODO: Reemplazar con fetch('/api/v1/register', { method: 'POST', body: {...} })
    AppState.registerUser({ name: nameInput.value.trim(), email: emailInput.value.trim() });
    Navigation.goTo('rubro');
  });
}

/* ========================================================================
 * 6. SELECCIÓN DE RUBRO
 * ===================================================================== */
/**
 * Flag: true justo después de terminar el registro (datos + rubro).
 * Lo lee renderPerfil() para abrir la pantalla de Perfil ya en modo
 * edición, así el usuario revisa y ajusta sus datos de inmediato.
 */
let justRegistered = false;

function initRubro() {
  const cards = document.querySelectorAll('.js-rubro-card');
  const confirmBtn = document.querySelector('.js-confirm-rubro');
  let selectedRubro = null;

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      cards.forEach((c) => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      selectedRubro = card.getAttribute('data-rubro');
      confirmBtn.disabled = false;
    });
  });

  confirmBtn?.addEventListener('click', () => {
    if (!selectedRubro) return;
    // TODO: Reemplazar con fetch('/api/v1/me/rubro', { method: 'PATCH', body: {...} })
    AppState.setRubro(selectedRubro);
    Animations.showToast('¡Cuenta creada! Revisá tus datos.');

    // Flujo post-registro: en vez de ir directo a Insumos, llevamos al
    // usuario a revisar/ajustar su perfil recién creado.
    justRegistered = true;
    setTimeout(() => Navigation.goTo('perfil'), 350);
  });
}

/* ========================================================================
 * 7. INSUMOS
 * ===================================================================== */
function initInsumos() {
  const modal = document.querySelector('.js-modal-insumo');
  const modalTitle = document.querySelector('.js-modal-insumo-title');
  const form = document.querySelector('.js-insumo-form');
  const nombreInput = document.querySelector('.js-insumo-nombre');
  const precioInput = document.querySelector('.js-insumo-precio');
  const openBtn = document.querySelector('.js-open-insumo-modal');
  const cancelBtn = document.querySelector('.js-modal-insumo-cancel');
  const searchInput = document.querySelector('.js-search-insumo');

  let editingId = null; // null = modo "crear", string = modo "editar"

  openBtn?.addEventListener('click', () => {
    editingId = null;
    modalTitle.textContent = 'Nuevo insumo';
    form.reset();
    Animations.openModal(modal);
    nombreInput.focus();
  });

  cancelBtn?.addEventListener('click', () => Animations.closeModal(modal));

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombreOk = validateRequired(nombreInput);
    const precioOk = validateRequired(precioInput);
    if (!nombreOk || !precioOk) return;

    const nombre = nombreInput.value.trim();
    const precio = Number(precioInput.value);

    if (editingId) {
      AppState.updateInsumo(editingId, { nombre, precio });
      Animations.showToast('Insumo actualizado');
    } else {
      AppState.addInsumo({ nombre, precio });
      Animations.showToast('Insumo agregado');
    }

    Animations.closeModal(modal);
    renderInsumos(searchInput.value);
  });

  searchInput?.addEventListener('input', () => renderInsumos(searchInput.value));

  // Delegación de eventos para editar/eliminar/CTA vacío (los items se re-renderizan)
  document.querySelector('.js-insumos-list')?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.js-edit-insumo');
    const deleteBtn = e.target.closest('.js-delete-insumo');
    const emptyAddBtn = e.target.closest('.js-empty-add-insumo');

    if (emptyAddBtn) {
      openBtn?.click();
      return;
    }

    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      const insumo = AppState.data.insumos.find((i) => i.id === id);
      if (!insumo) return;
      editingId = id;
      modalTitle.textContent = 'Editar insumo';
      nombreInput.value = insumo.nombre;
      precioInput.value = insumo.precio;
      Animations.openModal(modal);
      nombreInput.focus();
    }

    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      const itemEl = deleteBtn.closest('.list-item');
      Animations.removeListItem(itemEl).then(() => {
        AppState.deleteInsumo(id);
        Animations.showToast('Insumo eliminado', 'error');
        if (AppState.data.insumos.length === 0) renderInsumos();
      });
    }
  });
}

function renderInsumos(filter = '') {
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

/* ========================================================================
 * 8. COSTOS (FIJOS / VARIABLES / DESGLOSE)
 * ===================================================================== */
function initCostos() {
  const tabsBtns = document.querySelectorAll('.js-cost-tabs .tabs__btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabsBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      tabsBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      panels.forEach((p) => p.classList.toggle('is-active', p.getAttribute('data-tab-panel') === tab));
      if (tab === 'desglose') renderDesglose();
    });
  });

  const modal = document.querySelector('.js-modal-costo');
  const form = document.querySelector('.js-costo-form');
  const conceptoInput = document.querySelector('.js-costo-concepto');
  const categoriaInput = document.querySelector('.js-costo-categoria');
  const montoInput = document.querySelector('.js-costo-monto');
  const cancelBtn = document.querySelector('.js-modal-costo-cancel');
  let currentTipo = 'fijo';

  document.querySelectorAll('.js-open-costo-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentTipo = btn.getAttribute('data-tipo');
      form.reset();
      Animations.openModal(modal);
      conceptoInput.focus();
    });
  });

  cancelBtn?.addEventListener('click', () => Animations.closeModal(modal));

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const conceptoOk = validateRequired(conceptoInput);
    const montoOk = validateRequired(montoInput);
    if (!conceptoOk || !montoOk) return;

    AppState.addCosto(currentTipo, {
      concepto: conceptoInput.value.trim(),
      categoria: categoriaInput.value,
      monto: Number(montoInput.value),
    });

    Animations.closeModal(modal);
    Animations.showToast(currentTipo === 'fijo' ? 'Costo fijo agregado' : 'Costo variable agregado');
    renderCostos();
  });

  // Delegación para eliminar costos y para el CTA del empty state
  // (tanto en la lista de fijos como en la de variables)
  document.querySelectorAll('.js-costos-fijos-list, .js-costos-variables-list').forEach((list) => {
    list.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.js-delete-costo');
      const emptyAddBtn = e.target.closest('.js-empty-add-costo');

      if (emptyAddBtn) {
        currentTipo = emptyAddBtn.getAttribute('data-tipo') || currentTipo;
        form.reset();
        Animations.openModal(modal);
        conceptoInput.focus();
        return;
      }

      if (!deleteBtn) return;
      const id = deleteBtn.getAttribute('data-id');
      const tipo = deleteBtn.getAttribute('data-tipo');
      const itemEl = deleteBtn.closest('.list-item');
      Animations.removeListItem(itemEl).then(() => {
        AppState.deleteCosto(tipo, id);
        Animations.showToast('Costo eliminado', 'error');
        renderCostos();
      });
    });
  });
}

function renderCostos() {
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
      desc: tipo === 'fijo'
        ? 'Sumá gastos como alquiler, servicios o sueldos.'
        : 'Sumá gastos que varían según lo que produzcas o vendas.',
      ctaLabel: `+ Agregar primer costo ${tipo === 'fijo' ? 'fijo' : 'variable'}`,
      ctaClass: 'js-empty-add-costo',
    });
    list.querySelector('.js-empty-add-costo')?.setAttribute('data-tipo', tipo);
    return;
  }

  list.innerHTML = items.map((c) => `
    <div class="list-item" data-id="${c.id}">
      <div class="list-item__info">
        <div class="list-item__title">${escapeHtml(c.concepto)}</div>
        <div class="list-item__subtitle"><span class="badge badge--neutral">${escapeHtml(c.categoria)}</span></div>
      </div>
      <div class="list-item__price">$${formatNumber(c.monto)}</div>
      <div class="list-item__actions">
        <button class="list-item__action-btn list-item__action-btn--danger js-delete-costo" data-id="${c.id}" data-tipo="${tipo}" aria-label="Eliminar">🗑️</button>
      </div>
    </div>
  `).join('');
}

function renderResumenFijos() {
  const totalFijos = AppState.getTotalCostosFijos();
  const totalEl = document.querySelector('.js-total-fijos');
  const diarioEl = document.querySelector('.js-costo-diario');
  if (totalEl) totalEl.textContent = '$' + formatNumber(totalFijos);
  if (diarioEl) diarioEl.textContent = '$' + formatNumber(Math.round(totalFijos / 30));
}

function renderDesglose() {
  const totalFijos = AppState.getTotalCostosFijos();
  const totalVariables = AppState.getTotalCostosVariables();
  document.querySelector('.js-desglose-fijos').textContent = '$' + formatNumber(totalFijos);
  document.querySelector('.js-desglose-variables').textContent = '$' + formatNumber(totalVariables);
  document.querySelector('.js-desglose-total').textContent = '$' + formatNumber(totalFijos + totalVariables);
}

/* ========================================================================
 * 9. CÁLCULOS Y PRECIO DE VENTA
 * ===================================================================== */
function initCalculos() {
  const slider = document.querySelector('.js-margen-slider');
  const saveBtn = document.querySelector('.js-save-calculos');

  slider?.addEventListener('input', () => {
    AppState.data.calculos.margen = Number(slider.value);
    updateCalculosDisplay();
  });

  saveBtn?.addEventListener('click', () => {
    AppState.saveCalculos();
    Animations.showToast('Cambios guardados correctamente');
  });
}

function renderCalculos() {
  const { calculos } = AppState.data;
  const slider = document.querySelector('.js-margen-slider');
  if (slider) slider.value = calculos.margen;

  const costoUnidadEl = document.querySelector('.js-costo-unidad');
  if (costoUnidadEl) costoUnidadEl.textContent = '$' + formatNumber(calculos.costoUnidad);

  updateCalculosDisplay();

  const puntoEl = document.querySelector('.js-punto-equilibrio');
  const vendidasEl = document.querySelector('.js-vendidas');
  const progressEl = document.querySelector('.js-progress-equilibrio');
  if (puntoEl) puntoEl.textContent = calculos.puntoEquilibrio;
  if (vendidasEl) vendidasEl.textContent = calculos.unidadesVendidasMes;
  if (progressEl) {
    const pct = calculos.puntoEquilibrio > 0
      ? (calculos.unidadesVendidasMes / calculos.puntoEquilibrio) * 100
      : 0;
    Animations.growProgress(progressEl, pct);
  }
}

/** Recalcula precio sugerido y ganancia en base al margen actual. */
function updateCalculosDisplay() {
  const { calculos } = AppState.data;
  const margenBadge = document.querySelector('.js-margen-badge');
  const precioEl = document.querySelector('.js-precio-sugerido');
  const gananciaEl = document.querySelector('.js-ganancia');

  const ganancia = Math.round(calculos.costoUnidad * (calculos.margen / 100));
  const precioSugerido = calculos.costoUnidad + ganancia;

  if (margenBadge) margenBadge.textContent = calculos.margen + '%';
  if (precioEl) precioEl.textContent = '$' + formatNumber(precioSugerido);
  if (gananciaEl) gananciaEl.textContent = '$' + formatNumber(ganancia);
}

/* ========================================================================
 * 10. ESTADÍSTICAS / DASHBOARD
 * ===================================================================== */
function initEstadisticas() {
  // Esta pantalla es principalmente de lectura; su interactividad
  // (botón de engranaje) ya está resuelta por Navigation.bindGotoLinks().
}

function renderEstadisticas() {
  const { estadisticas } = AppState.data;

  document.querySelector('.js-periodo').textContent = estadisticas.periodo;

  Animations.countUp(document.querySelector('.js-kpi-ingresos'), estadisticas.ingresos);
  Animations.countUp(document.querySelector('.js-kpi-costos'), estadisticas.costos);

  const margenPct = estadisticas.ingresos > 0
    ? Math.round(((estadisticas.ingresos - estadisticas.costos) / estadisticas.ingresos) * 1000) / 10
    : 0;
  const margenEl = document.querySelector('.js-kpi-margen');
  if (margenEl) margenEl.textContent = margenPct + '%';

  renderBarChart(estadisticas.ingresosPorMes);
  renderRankList(estadisticas.productosRentables);
}

function renderBarChart(meses) {
  const container = document.querySelector('.js-bar-chart');
  if (!container) return;

  if (meses.length === 0) {
    container.innerHTML = renderEmptyState({
      icon: '📊',
      title: 'Todavía no hay ingresos cargados',
      desc: 'A medida que registres ventas vas a ver la evolución mes a mes acá.',
      inline: true,
    });
    return;
  }

  const isLast = (i) => i === meses.length - 1;

  container.innerHTML = meses.map((m, i) => `
    <div class="bar-chart__col">
      <div class="bar-chart__bar${isLast(i) ? ' is-current' : ''}" style="height:0%"></div>
      <span class="bar-chart__label">${escapeHtml(m.mes)}</span>
    </div>
  `).join('');

  // Se dispara luego del render para que la transición de height sea visible
  requestAnimationFrame(() => {
    Animations.growBars(container, meses.map((m) => m.valor));
  });
}

function renderRankList(productos) {
  const container = document.querySelector('.js-rank-list');
  if (!container) return;

  if (productos.length === 0) {
    container.innerHTML = renderEmptyState({
      icon: '🏆',
      title: 'Sin productos rentables todavía',
      desc: 'Cuando registres ventas, acá vas a ver tu ranking de productos.',
      inline: true,
    });
    return;
  }

  container.innerHTML = productos.map((p) => `
    <div class="rank-item">
      <div class="rank-item__top">
        <span class="rank-item__name">${escapeHtml(p.nombre)}</span>
        <span class="rank-item__pct">${p.porcentaje}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:0%" data-target-pct="${p.porcentaje}"></div>
      </div>
    </div>
  `).join('');

  requestAnimationFrame(() => {
    container.querySelectorAll('.progress-fill').forEach((el) => {
      Animations.growProgress(el, Number(el.getAttribute('data-target-pct')));
    });
  });
}

/* ========================================================================
 * 11. CONFIGURACIÓN / MI PERFIL (mock)
 * ===================================================================== */
/**
 * Activa/desactiva el modo edición de la pantalla de Perfil. Se expone
 * fuera de initPerfil() porque también se usa justo después de terminar
 * el registro, para que el usuario revise sus datos de una.
 */
function setPerfilEditMode(isEditing) {
  const editarBtn = document.querySelector('.js-perfil-editar');
  const guardarBtn = document.querySelector('.js-perfil-guardar');
  const inputs = document.querySelectorAll('.js-perfil-nombre, .js-perfil-email, .js-perfil-rubro');

  inputs.forEach((input) => (input.disabled = !isEditing));
  if (editarBtn) editarBtn.style.display = isEditing ? 'none' : '';
  if (guardarBtn) guardarBtn.style.display = isEditing ? '' : 'none';
}

function initPerfil() {
  const form = document.querySelector('.js-perfil-form');
  const editarBtn = document.querySelector('.js-perfil-editar');
  const nombreInput = document.querySelector('.js-perfil-nombre');
  const emailInput = document.querySelector('.js-perfil-email');
  const rubroInput = document.querySelector('.js-perfil-rubro');

  editarBtn?.addEventListener('click', () => {
    setPerfilEditMode(true);
    nombreInput?.focus();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameOk = validateRequired(nombreInput);
    const emailOk = validateEmail(emailInput);
    if (!nameOk || !emailOk) return;

    AppState.updateProfile({
      name: nombreInput.value.trim(),
      email: emailInput.value.trim(),
      rubro: rubroInput.value,
    });

    setPerfilEditMode(false);
    Animations.showToast('Datos actualizados correctamente');
  });
}

function renderPerfil() {
  const { user } = AppState.data;
  const nombreEl = document.querySelector('.js-perfil-nombre');
  const emailEl = document.querySelector('.js-perfil-email');
  const rubroEl = document.querySelector('.js-perfil-rubro');

  if (nombreEl) nombreEl.value = user.name || '';
  if (emailEl) emailEl.value = user.email || '';
  if (rubroEl && user.rubro) rubroEl.value = user.rubro;

  // Justo después de registrarse arranca en modo edición, para que el
  // usuario revise/ajuste sus datos de una; en cualquier otro caso
  // (navegación normal desde el menú) arranca en modo lectura.
  setPerfilEditMode(Boolean(justRegistered));
  if (justRegistered) justRegistered = false;
}

/* ========================================================================
 * MODO CLARO / OSCURO (theme toggle)
 * ===================================================================== */
const THEME_STORAGE_KEY = 'emprendapp_theme';

function initTheme() {
  const root = document.documentElement;
  const toggleBtns = document.querySelectorAll('.js-theme-toggle');

  // TODO: cuando exista backend real, la preferencia de tema podría
  // guardarse en el perfil del usuario en vez de (o además de) localStorage.
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

/* ========================================================================
 * MICROINTERACCIONES — efecto "ripple" al hacer clic en botones
 * ===================================================================== */
function initMicrointeractions() {
  const RIPPLE_SELECTOR = '.btn, .btn-fab, .btn-icon-round, .theme-toggle-btn, .select-card, .tabs__btn, .list-item__action-btn';

  document.addEventListener('click', (e) => {
    const target = e.target.closest(RIPPLE_SELECTOR);
    if (!target || target.disabled) return;
    Animations.spawnRipple(target, e);
  });
}

/* ========================================================================
 * VALIDACIONES DE FORMULARIO (helpers reutilizables)
 * ===================================================================== */
function showFieldError(input, show) {
  const errorEl = input.closest('.field')?.querySelector('.field__error');
  input.classList.toggle('field__input--invalid', show);
  if (errorEl) errorEl.classList.toggle('is-visible', show);
  return !show;
}

function validateRequired(input) {
  const ok = input.value.trim().length > 0;
  return showFieldError(input, !ok);
}

function validateEmail(input) {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  return showFieldError(input, !ok);
}

function validateMinLength(input, min) {
  const ok = input.value.trim().length >= min;
  return showFieldError(input, !ok);
}

function validatePasswordsMatch(passInput, repeatInput) {
  const ok = passInput.value === repeatInput.value && repeatInput.value.length > 0;
  return showFieldError(repeatInput, !ok);
}

/**
 * Genera el markup de un "empty state" elegante y reutilizable:
 * ícono en círculo, título, descripción opcional y CTA opcional.
 * @param {Object} opts
 * @param {string} opts.icon - Emoji/ícono central.
 * @param {string} opts.title - Frase principal (ej: "No tenés insumos...").
 * @param {string} [opts.desc] - Texto secundario opcional.
 * @param {string} [opts.ctaLabel] - Texto del botón de acción (si se omite, no hay CTA).
 * @param {string} [opts.ctaClass] - Clase para enganchar el click del CTA vía JS.
 * @param {boolean} [opts.inline] - Usa la variante compacta sin borde/fondo propio.
 */
function renderEmptyState({ icon, title, desc = '', ctaLabel = '', ctaClass = '', inline = false }) {
  return `
    <div class="empty-state${inline ? ' empty-state--inline' : ''}">
      <div class="empty-state__icon-wrap"><span class="empty-state__icon">${icon}</span></div>
      <p class="empty-state__title">${escapeHtml(title)}</p>
      ${desc ? `<p class="empty-state__desc">${escapeHtml(desc)}</p>` : ''}
      ${ctaLabel ? `<button type="button" class="btn btn-primary u-max-w-form empty-state__cta ${ctaClass}">${escapeHtml(ctaLabel)}</button>` : ''}
    </div>`;
}

/** Escapa HTML para prevenir inyección al renderizar texto dinámico. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
