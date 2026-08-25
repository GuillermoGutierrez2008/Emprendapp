/* ==========================================================================
   STATE.JS — Simulación de estado / "mock backend"
   --------------------------------------------------------------------------
   Toda la persistencia se maneja acá, usando localStorage como si fuera
   una base de datos remota. Cuando exista backend real, este archivo es
   el único lugar que debería tocarse: cada función ya está separada como
   si fuera una llamada a la API (con su comentario TODO correspondiente).
   ========================================================================== */

const STORAGE_KEY = 'emprendapp_state_v1';

/**
 * Estado inicial "de fábrica". Se usa la primera vez que se abre la app,
 * o si el usuario resetea sus datos.
 */
function getDefaultState() {
  return {
    // ---- Sesión / usuario ----
    user: {
      isLoggedIn: false,
      name: '',
      email: '',
      rubro: null, // 'kiosco' | 'rotiseria' | 'marroquineria' | 'impresion3d'
    },

    // ---- Insumos (Pantalla 7) ----
    // Arranca vacío: el usuario carga sus propios insumos desde cero
    // (ver renderInsumos() en app.js, que muestra el empty state).
    insumos: [],

    // ---- Costos fijos y variables (Pantalla 8) ----
    costosFijos: [],
    costosVariables: [],

    // ---- Cálculos de precio (Pantalla 9) ----
    calculos: {
      costoUnidad: 0,
      margen: 40, // porcentaje
      puntoEquilibrio: 0,
      unidadesVendidasMes: 0,
    },

    // ---- Estadísticas (Pantalla 10) ----
    estadisticas: {
      periodo: getCurrentPeriodLabel(),
      ingresos: 0,
      costos: 0,
      ingresosPorMes: [],
      productosRentables: [],
    },
  };
}

/** Etiqueta "Mes Año" (ej: "Agosto 2026") para el período actual, en es-AR. */
function getCurrentPeriodLabel() {
  const label = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Objeto global "AppState": envoltorio simple sobre localStorage.
 * Simula un cliente de API: get(), set(), y helpers de dominio.
 */
const AppState = {
  data: null,

  /** Carga el estado desde localStorage, o crea uno nuevo si no existe. */
  load() {
    // TODO: Reemplazar con fetch('/api/v1/me/state') cuando exista backend real
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this.data = raw ? JSON.parse(raw) : getDefaultState();
    } catch (err) {
      console.warn('No se pudo leer localStorage, se usa estado por defecto.', err);
      this.data = getDefaultState();
    }
    return this.data;
  },

  /** Persiste el estado actual en localStorage. */
  save() {
    // TODO: Reemplazar con fetch('/api/v1/me/state', { method: 'PUT', body: ... })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (err) {
      console.warn('No se pudo guardar en localStorage.', err);
    }
  },

  /** Reinicia todo a los valores de fábrica (útil para testing/demo). */
  reset() {
    this.data = getDefaultState();
    this.save();
  },

  // ------------------------------------------------------------------ //
  // USUARIO / SESIÓN
  // ------------------------------------------------------------------ //
  login(email) {
    // TODO: Reemplazar con fetch('/api/v1/login', { method: 'POST', body: { email, password } })
    this.data.user.isLoggedIn = true;
    this.data.user.email = email;
    this.save();
  },

  registerUser({ name, email }) {
    // TODO: Reemplazar con fetch('/api/v1/register', { method: 'POST', body: {...} })
    this.data.user.name = name;
    this.data.user.email = email;
    this.save();
  },

  setRubro(rubro) {
    // TODO: Reemplazar con fetch('/api/v1/me/rubro', { method: 'PATCH', body: { rubro } })
    this.data.user.rubro = rubro;
    this.data.user.isLoggedIn = true;
    this.save();
  },

  updateProfile({ name, email, rubro }) {
    // TODO: Reemplazar con fetch('/api/v1/me', { method: 'PATCH', body: { name, email, rubro } })
    if (name !== undefined) this.data.user.name = name;
    if (email !== undefined) this.data.user.email = email;
    if (rubro !== undefined) this.data.user.rubro = rubro;
    this.save();
  },

  // ------------------------------------------------------------------ //
  // INSUMOS
  // ------------------------------------------------------------------ //
  addInsumo({ nombre, precio }) {
    // TODO: Reemplazar con fetch('/api/v1/insumos', { method: 'POST', body: {...} })
    const id = 'ins-' + Date.now();
    this.data.insumos.push({ id, nombre, precio });
    this.save();
    return id;
  },

  updateInsumo(id, { nombre, precio }) {
    // TODO: Reemplazar con fetch(`/api/v1/insumos/${id}`, { method: 'PUT', body: {...} })
    const item = this.data.insumos.find((i) => i.id === id);
    if (item) {
      item.nombre = nombre;
      item.precio = precio;
      this.save();
    }
  },

  deleteInsumo(id) {
    // TODO: Reemplazar con fetch(`/api/v1/insumos/${id}`, { method: 'DELETE' })
    this.data.insumos = this.data.insumos.filter((i) => i.id !== id);
    this.save();
  },

  // ------------------------------------------------------------------ //
  // COSTOS (fijos y variables comparten forma, distinta lista)
  // ------------------------------------------------------------------ //
  addCosto(tipo, { concepto, categoria, monto }) {
    // TODO: Reemplazar con fetch(`/api/v1/costos/${tipo}`, { method: 'POST', body: {...} })
    const lista = tipo === 'fijo' ? this.data.costosFijos : this.data.costosVariables;
    const id = 'c-' + Date.now();
    lista.push({ id, concepto, categoria, monto });
    this.save();
    return id;
  },

  deleteCosto(tipo, id) {
    // TODO: Reemplazar con fetch(`/api/v1/costos/${tipo}/${id}`, { method: 'DELETE' })
    if (tipo === 'fijo') {
      this.data.costosFijos = this.data.costosFijos.filter((c) => c.id !== id);
    } else {
      this.data.costosVariables = this.data.costosVariables.filter((c) => c.id !== id);
    }
    this.save();
  },

  getTotalCostosFijos() {
    return this.data.costosFijos.reduce((sum, c) => sum + Number(c.monto), 0);
  },

  getTotalCostosVariables() {
    return this.data.costosVariables.reduce((sum, c) => sum + Number(c.monto), 0);
  },

  // ------------------------------------------------------------------ //
  // CÁLCULOS DE PRECIO
  // ------------------------------------------------------------------ //
  setMargen(margen) {
    this.data.calculos.margen = margen;
    this.save();
  },

  saveCalculos() {
    // TODO: Reemplazar con fetch('/api/v1/calculos', { method: 'PUT', body: {...} })
    this.save();
  },
};
