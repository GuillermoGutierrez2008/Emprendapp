/* ==========================================================================
   STATE.JS — Capa de Datos Asíncrona (Manejo del estado de la aplicación)
   --------------------------------------------------------------------------
   IMPORTANTE: Todas las funciones usan `async/await` y devuelven Promesas.
   Hoy leen/guardan en localStorage, pero la firma asíncrona permite cambiar
   el código interno por peticiones `fetch()` a PHP sin tocar la UI.
   ========================================================================== */

// Clave con la que se guarda la información en el navegador
const STORAGE_KEY = 'emprendapp_state_v1';

/**
 * Devuelve la estructura base de datos cuando la app se ejecuta por primera vez.
 */
function getDefaultState() {
  return {
    user: { isLoggedIn: false, name: '', email: '', rubro: null },
    insumos: [],
    costosFijos: [],
    costosVariables: [],
    calculos: { costoUnidad: 0, margen: 40, puntoEquilibrio: 0, unidadesVendidasMes: 0 },
    estadisticas: { periodo: getCurrentPeriodLabel(), ingresos: 0, costos: 0, ingresosPorMes: [], productosRentables: [] }
  };
}

/**
 * Genera el nombre del mes y año actual (Ej: "Agosto 2026").
 */
function getCurrentPeriodLabel() {
  const label = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export const AppState = {
  data: null,

  /**
   * Carga la información desde localStorage al iniciar la aplicación.
   */
  async load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this.data = raw ? JSON.parse(raw) : getDefaultState();
    } catch (err) {
      console.warn('No se pudo leer localStorage, se usa estado por defecto.', err);
      this.data = getDefaultState();
    }
    return this.data;
  },

  /**
   * Guarda los cambios actuales en localStorage.
   */
  async save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (err) {
      console.warn('No se pudo guardar en localStorage.', err);
    }
  },

  /**
   * Limpia los datos almacenados y resetea a fábrica.
   */
  async reset() {
    this.data = getDefaultState();
    await this.save();
  },

  // --- SECCIÓN: USUARIO Y SESIÓN ---

  async login(email) {
    this.data.user.isLoggedIn = true;
    this.data.user.email = email;
    await this.save();
  },

  async registerUser({ name, email }) {
    this.data.user.name = name;
    this.data.user.email = email;
    await this.save();
  },

  async setRubro(rubro) {
    this.data.user.rubro = rubro;
    this.data.user.isLoggedIn = true;
    await this.save();
  },

  async updateProfile({ name, email, rubro }) {
    if (name !== undefined) this.data.user.name = name;
    if (email !== undefined) this.data.user.email = email;
    if (rubro !== undefined) this.data.user.rubro = rubro;
    await this.save();
  },

  // --- SECCIÓN: INSUMOS ---

  /**
   * Conecta con PHP para traer los insumos reales de la base de datos MySQL.
   */
  async cargarInsumos() {
    try {
      // Ajustá esta ruta dependiendo de dónde esté tu index.html respecto al PHP
      const respuesta = await fetch('../obtener_insumos.php');
      
      if (!respuesta.ok) throw new Error('Error de red al conectar con PHP');
      
      const insumosBD = await respuesta.json();
      
      // Reemplaza el array vacío con los datos de MySQL
      this.data.insumos = insumosBD;
      
      // Opcional: guardamos esta copia en localStorage para tenerla en caché
      await this.save(); 
      
      return true;
    } catch (error) {
      console.error("Error al traer los insumos de la base de datos:", error);
      return false;
    }
  },

  async addInsumo({ nombre, precio }) {
    const id = 'ins-' + Date.now();
    this.data.insumos.push({ id, nombre, precio });
    await this.save();
    return id; // Retorna el ID generado para que el UI pueda asociarlo
  },

  async updateInsumo(id, { nombre, precio }) {
    const item = this.data.insumos.find((i) => i.id === id);
    if (item) {
      item.nombre = nombre;
      item.precio = precio;
      await this.save();
    }
  },

  async deleteInsumo(id) {
    this.data.insumos = this.data.insumos.filter((i) => i.id !== id);
    await this.save();
  },

  // --- SECCIÓN: COSTOS FIJOS Y VARIABLES ---

  async addCosto(tipo, { concepto, categoria, monto }) {
    const lista = tipo === 'fijo' ? this.data.costosFijos : this.data.costosVariables;
    const id = 'c-' + Date.now();
    lista.push({ id, concepto, categoria, monto });
    await this.save();
    return id;
  },

  async deleteCosto(tipo, id) {
    if (tipo === 'fijo') {
      this.data.costosFijos = this.data.costosFijos.filter((c) => c.id !== id);
    } else {
      this.data.costosVariables = this.data.costosVariables.filter((c) => c.id !== id);
    }
    await this.save();
  },

  async getTotalCostosFijos() {
    return this.data.costosFijos.reduce((sum, c) => sum + Number(c.monto), 0);
  },

  async getTotalCostosVariables() {
    return this.data.costosVariables.reduce((sum, c) => sum + Number(c.monto), 0);
  },

  // --- SECCIÓN: CÁLCULOS ---

  async setMargen(margen) {
    this.data.calculos.margen = margen;
    await this.save();
  },

  async saveCalculos() {
    await this.save();
  }
};