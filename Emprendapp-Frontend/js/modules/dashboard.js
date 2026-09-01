/* ==========================================================================
   DASHBOARD.JS — Estadísticas y KPIs
   ========================================================================== */
import { AppState } from '../core/state.js';
import { Animations } from '../core/animations.js';
import { escapeHtml, renderEmptyState } from '../ui/utils.js';

export function initDashboard() {
  // Principalmente de lectura, la interactividad ya la maneja navigation.js
}

export function renderEstadisticas() {
  const { estadisticas } = AppState.data;

  const periodoEl = document.querySelector('.js-periodo');
  if (periodoEl) periodoEl.textContent = estadisticas.periodo;

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