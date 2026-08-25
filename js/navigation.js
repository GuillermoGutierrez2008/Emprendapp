/* ==========================================================================
   NAVIGATION.JS — Manejo de vistas (SPA) y transiciones entre pantallas
   ========================================================================== */

const Navigation = {
  currentScreen: 'splash',

  // Pantallas "principales" de la app: son las únicas que muestran el
  // header superior fijo (con el botón hamburguesa) y las que aparecen
  // resaltadas/enlazadas en el menú lateral (drawer).
  APP_SCREENS: {
    insumos: { title: 'Insumos' },
    costos: { title: 'Costos' },
    calculos: { title: 'Cálculos' },
    estadisticas: { title: 'Estadísticas' },
    perfil: { title: 'Mi perfil' },
  },

  /**
   * Cambia de pantalla activa dentro de la SPA, aplicando animación de
   * salida a la actual y de entrada a la nueva.
   * @param {string} screenName - valor de data-screen (ej: 'login')
   */
  goTo(screenName) {
    const nextEl = document.querySelector(`[data-screen="${screenName}"]`);
    const currentEl = document.querySelector(`[data-screen="${this.currentScreen}"]`);

    if (!nextEl || nextEl === currentEl) return;

    // Notificamos a app.js que se va a mostrar una pantalla, para que
    // pueda refrescar sus datos dinámicos antes de que se vea.
    document.dispatchEvent(new CustomEvent('screen:before-show', { detail: { screen: screenName } }));

    if (currentEl) {
      currentEl.classList.remove('screen--enter');
      currentEl.classList.add('screen--exit');
      currentEl.addEventListener('animationend', function handler() {
        currentEl.classList.remove('is-active', 'screen--exit');
        currentEl.removeEventListener('animationend', handler);
      }, { once: true });
    }

    nextEl.classList.add('is-active', 'screen--enter');
    this.currentScreen = screenName;

    // Muestra/oculta el header fijo según el tipo de pantalla, y
    // actualiza su título con el nombre de la sección activa.
    const appScreenInfo = this.APP_SCREENS[screenName];
    document.body.classList.toggle('has-app-header', Boolean(appScreenInfo));
    const headerTitleEl = document.querySelector('.js-header-title');
    if (headerTitleEl && appScreenInfo) headerTitleEl.textContent = appScreenInfo.title;

    // Resalta en el drawer el enlace correspondiente a la pantalla activa.
    document.querySelectorAll('.js-drawer-link').forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('data-target') === screenName);
    });

    // Al cambiar de vista, siempre volvemos al scroll superior.
    window.scrollTo({ top: 0, behavior: 'instant' });
    const appEl = document.getElementById('app');
    if (appEl) appEl.scrollTop = 0;

    document.dispatchEvent(new CustomEvent('screen:after-show', { detail: { screen: screenName } }));
  },

  /**
   * Conecta todos los elementos con clase .js-goto a la navegación,
   * leyendo su atributo data-target. Se llama una vez al iniciar la app.
   */
  bindGotoLinks() {
    document.querySelectorAll('.js-goto').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = el.getAttribute('data-target');
        if (target) this.goTo(target);
      });
    });
  },
};
