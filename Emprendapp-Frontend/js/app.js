/* ==========================================================================
   APP.JS — Orquestador Principal de EmprendApp
   ========================================================================== */
import { AppState } from './core/state.js';
import { Navigation } from './core/navigation.js';
import { initTheme } from './ui/theme.js';
import { initDrawer } from './ui/drawer.js';
import { initMicrointeractions } from './ui/utils.js';

// Importación de módulos de dominio
import { initAuth } from './modules/auth.js';
import { initInventory, renderInsumos } from './modules/inventory.js';
import { initFinance, renderCostos, renderCalculos } from './modules/finance.js';
import { initDashboard, renderEstadisticas } from './modules/dashboard.js';
import { initProfile, renderPerfil } from './modules/profile.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Inicializar estado central asíncrono
  await AppState.load();

  // 2. Inicializar UI y Navegación
  Navigation.bindGotoLinks();
  initTheme();
  initDrawer();
  initMicrointeractions();

  // 3. Inicializar eventos de cada dominio
  initAuth();
  initInventory();
  initFinance();
  initDashboard();
  initProfile();

  // 4. Delegar el renderizado dinámico al cambiar de pantalla
  document.addEventListener('screen:before-show', (e) => {
    const { screen } = e.detail;
    
    const renderMap = {
      'insumos': renderInsumos,
      'costos': renderCostos,
      'calculos': renderCalculos,
      'estadisticas': renderEstadisticas,
      'perfil': renderPerfil
    };

    if (renderMap[screen]) {
      // Usamos un bloque try/catch genérico por si los renders futuros 
      // dependen de llamadas asíncronas al backend real
      try {
        renderMap[screen]();
      } catch (error) {
        console.error(`Error renderizando la pantalla ${screen}:`, error);
      }
    }
  });
});