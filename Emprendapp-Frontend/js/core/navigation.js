/* ==========================================================================
   NAVIGATION.JS — Módulo para el control de pantallas (Single Page Application)
   ========================================================================== */
import { inicializarPantallaInsumos } from '../modules/inventory.js';

export const Navigation = {
  // Guarda el nombre de la vista que está activa actualmente
  currentScreen: 'splash',

  // Configuración de los títulos para el encabezado superior
  APP_SCREENS: {
    insumos: { title: 'Insumos' },
    costos: { title: 'Costos' },
    calculos: { title: 'Cálculos' },
    estadisticas: { title: 'Estadísticas' },
    perfil: { title: 'Mi perfil' },
  },

  /**
   * Cambia la pantalla visible y coordina las animaciones de transición.
   * @param {string} screenName - Valor de data-screen en el HTML (ej: 'insumos')
   */
  goTo(screenName) {
    const nextEl = document.querySelector(`[data-screen="${screenName}"]`);
    const currentEl = document.querySelector(`[data-screen="${this.currentScreen}"]`);

    // Si la pantalla buscada no existe o es la misma donde ya estamos, no hace nada
    if (!nextEl || nextEl === currentEl) return;

    // --- CONEXIÓN CON LA BASE DE DATOS ---
    // Si la pantalla a la que vamos es "insumos", vamos a buscar los datos a PHP
    if (screenName === 'insumos') {
      inicializarPantallaInsumos();
    }
    // -------------------------------------

    // Emitimos un evento personalizado para avisar que la pantalla va a cambiar
    document.dispatchEvent(new CustomEvent('screen:before-show', { detail: { screen: screenName } }));

    // Animamos la salida de la pantalla actual
    if (currentEl) {
      currentEl.classList.remove('screen--enter');
      currentEl.classList.add('screen--exit');
      currentEl.addEventListener('animationend', function handler() {
        currentEl.classList.remove('is-active', 'screen--exit');
        currentEl.removeEventListener('animationend', handler);
      }, { once: true });
    }

    // Activamos la nueva pantalla
    nextEl.classList.add('is-active', 'screen--enter');
    this.currentScreen = screenName;

    // Actualizamos el título del header según la pantalla seleccionada
    const appScreenInfo = this.APP_SCREENS[screenName];
    document.body.classList.toggle('has-app-header', Boolean(appScreenInfo));
    const headerTitleEl = document.querySelector('.js-header-title');
    if (headerTitleEl && appScreenInfo) headerTitleEl.textContent = appScreenInfo.title;

    // Marcamos como activo el botón correspondiente en el menú lateral
    document.querySelectorAll('.js-drawer-link').forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('data-target') === screenName);
    });

    // Reseteamos el scroll arriba
    window.scrollTo({ top: 0, behavior: 'instant' });
    const appEl = document.getElementById('app');
    if (appEl) appEl.scrollTop = 0;

    // Emitimos evento de confirmación de pantalla mostrada
    document.dispatchEvent(new CustomEvent('screen:after-show', { detail: { screen: screenName } }));
  },

  /**
   * Escucha todos los clics en elementos con la clase .js-goto y activa la navegación.
   */
  bindGotoLinks() {
    document.querySelectorAll('.js-goto').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = el.getAttribute('data-target');
        if (target) this.goTo(target);
      });
    });
  }
};