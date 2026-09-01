/* ==========================================================================
   ANIMATIONS.JS — Módulo de utilidades de animación e interacción
   --------------------------------------------------------------------------
   Exportamos funciones individuales y un objeto contenedor para usar
   en cualquier parte del proyecto sin contaminar el espacio global.
   ========================================================================== */

/**
 * Helper para formatear números a moneda local (Peso Argentino).
 * Ejemplo: 15000 -> "15.000"
 */
export function formatNumber(value) {
  return new Intl.NumberFormat('es-AR').format(value);
}

export const Animations = {
  /**
   * Anima un contador numérico progresivo desde 0 hasta el valor destino.
   * Útil para resaltar totales o precios calculados.
   */
  countUp(el, targetValue, { prefix = '$', duration = 700, formatter = null } = {}) {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();

    function frame(now) {
      // Calculamos el porcentaje de tiempo transcurrido (0 a 1)
      const progress = Math.min((now - startTime) / duration, 1);
      // Aplicamos un efecto de desaceleración suave (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (targetValue - start) * eased);
      
      // Renderizamos el número formateado
      el.textContent = formatter ? formatter(current) : prefix + formatNumber(current);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  },

  /**
   * Ajusta suavemente el ancho de una barra de progreso en base a un porcentaje (0 a 100).
   */
  growProgress(el, targetPct) {
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.width = Math.min(Math.max(targetPct, 0), 100) + '%';
    });
  },

  /**
   * Anima la altura de las barras en los gráficos de estadísticas.
   */
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

  /**
   * Crea y muestra una alerta flotante (Toast) en pantalla que desaparece sola.
   * @param {string} message - Texto a mostrar.
   * @param {string} type - Tipo de notificación ('success' o 'error').
   */
  showToast(message, type = 'success') {
    const container = document.querySelector('.js-toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'error' ? ' toast--error' : '');
    toast.textContent = message;
    container.appendChild(toast);

    // Se elimina automáticamente del DOM al finalizar la animación
    setTimeout(() => toast.remove(), 3300);
  },

  /**
   * Abre una ventana modal agregando la clase CSS correspondiente.
   */
  openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('is-open');
  },

  /**
   * Cierra una ventana modal quitando la clase CSS.
   */
  closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
  },

  /**
   * Anima la salida de un elemento antes de borrarlo del HTML (ej. al eliminar insumos).
   * Devuelve una Promesa para esperar que la animación termine.
   */
  removeListItem(el) {
    return new Promise((resolve) => {
      if (!el) return resolve();
      el.classList.add('is-removing');
      
      // Escucha cuándo finaliza la animación CSS para remover el nodo
      el.addEventListener('animationend', () => {
        el.remove();
        resolve(); // Avisa que la eliminación se completó
      }, { once: true });
    });
  },

  /**
   * Genera el efecto visual de "ola/onda" (Ripple) al hacer clic en un botón.
   */
  spawnRipple(el, event) {
    // Si el usuario desactivó animaciones en su sistema operativo, se ignora
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

    const prevPosition = getComputedStyle(el).position;
    if (prevPosition === 'static') el.classList.add('u-ripple-host');

    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }
};