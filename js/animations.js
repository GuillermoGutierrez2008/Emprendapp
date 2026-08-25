/* ==========================================================================
   ANIMATIONS.JS — Utilidades de animación (CSS keyframes + JS)
   --------------------------------------------------------------------------
   Nota: el proyecto usa animaciones CSS puras (ver screens.css/components.css)
   disparadas mediante clases. Este archivo centraliza los helpers en JS que
   coordinan esas clases y las animaciones "numéricas" (contadores, barras).
   ========================================================================== */

const Animations = {
  /**
   * Anima un número desde 0 (o desde su valor actual) hasta targetValue,
   * actualizando el texto del elemento en cada frame. Usado en KPIs y
   * en montos destacados como el precio sugerido.
   */
  countUp(el, targetValue, { prefix = '$', duration = 700, formatter = null } = {}) {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Easing tipo ease-out para que la animación se sienta suave
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (targetValue - start) * eased);
      el.textContent = formatter ? formatter(current) : prefix + formatNumber(current);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  },

  /** Anima el ancho de una barra de progreso (0% -> targetPct%). */
  growProgress(el, targetPct) {
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.width = Math.min(Math.max(targetPct, 0), 100) + '%';
    });
  },

  /** Anima la altura de las barras del gráfico de barras (Estadísticas). */
  growBars(container, values) {
    const bars = container.querySelectorAll('.bar-chart__bar');
    const max = Math.max(...values, 1);
    bars.forEach((bar, i) => {
      const pct = (values[i] / max) * 100;
      requestAnimationFrame(() => {
        bar.style.height = pct + '%';
      });
    });
  },

  /** Muestra un toast de notificación flotante. type: 'success' | 'error'. */
  showToast(message, type = 'success') {
    const container = document.querySelector('.js-toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'error' ? ' toast--error' : '');
    toast.textContent = message;
    container.appendChild(toast);
    // Se elimina del DOM luego de que termina la animación de salida (~3.2s)
    setTimeout(() => toast.remove(), 3300);
  },

  /** Abre un modal (overlay) agregando la clase de estado. */
  openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('is-open');
  },

  /** Cierra un modal (overlay). */
  closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
  },

  /**
   * Anima la salida de un elemento de lista antes de removerlo del DOM
   * (usado al eliminar insumos/costos), devuelve una Promise.
   */
  removeListItem(el) {
    return new Promise((resolve) => {
      if (!el) return resolve();
      el.classList.add('is-removing');
      el.addEventListener('animationend', () => {
        el.remove();
        resolve();
      }, { once: true });
    });
  },

  /**
   * Crea un pequeño círculo que se expande desde el punto de clic y se
   * desvanece (efecto "ripple" de Material Design), usado como
   * microinteracción en botones y tarjetas seleccionables.
   */
  spawnRipple(el, event) {
    // Respeta la preferencia de movimiento reducido del usuario
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const clientX = event.clientX ?? rect.left + rect.width / 2;
    const clientY = event.clientY ?? rect.top + rect.height / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = clientX - rect.left - size / 2 + 'px';
    ripple.style.top = clientY - rect.top - size / 2 + 'px';

    // Asegura que el contenedor pueda recortar el ripple y posicionarlo
    const prevPosition = getComputedStyle(el).position;
    if (prevPosition === 'static') el.classList.add('u-ripple-host');

    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  },
};

/** Formatea números como moneda simple con separador de miles (es-AR). */
function formatNumber(value) {
  return new Intl.NumberFormat('es-AR').format(value);
}
