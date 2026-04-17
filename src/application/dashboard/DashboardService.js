// src/application/dashboard/DashboardService.js
const prisma = require("../../infrastructure/database/prisma");

class DashboardService {
  constructor(seguimientoRepository, controlRepository) {
    this.seguimientoRepository = seguimientoRepository;
    this.controlRepository = controlRepository;
  }

  async getTotalControles() {
    const todos = await this.controlRepository.findAll();
    return todos.length;
  }

  /**
   * Obtiene el último seguimiento por cada control (el más reciente)
   */
  async getUltimosSeguimientosPorControl(empresaId) {
    const todos = await this.seguimientoRepository.findByEmpresa(empresaId);

    // Ordenar por fecha descendente (más reciente primero)
    const ordenados = [...todos].sort(
      (a, b) =>
        new Date(b.fecha_de_modificacion) - new Date(a.fecha_de_modificacion),
    );

    const ultimosPorControl = new Map();
    for (const seg of ordenados) {
      if (!ultimosPorControl.has(seg.control_id)) {
        ultimosPorControl.set(seg.control_id, seg);
      }
    }

    return Array.from(ultimosPorControl.values());
  }

  async getMetricas(empresaId) {
    const TOTAL_CONTROLES = await this.getTotalControles();
    const ultimosSeguimientos =
      await this.getUltimosSeguimientosPorControl(empresaId);

    const conteo = {
      Completado: 0,
      "En Progreso": 0,
      "Pendiente Novedad": 0,
      "No Iniciado": 0,
    };

    for (const s of ultimosSeguimientos) {
      const estadoNombre = s.estados_de_control?.nombre_del_estado;
      if (estadoNombre && conteo.hasOwnProperty(estadoNombre)) {
        conteo[estadoNombre]++;
      } else if (estadoNombre && !conteo.hasOwnProperty(estadoNombre)) {
        conteo[estadoNombre] = (conteo[estadoNombre] || 0) + 1;
      }
    }

    const sinSeguimiento = TOTAL_CONTROLES - ultimosSeguimientos.length;
    conteo["No Iniciado"] += sinSeguimiento;

    const evaluados = ultimosSeguimientos.length;
    const cumplidos = conteo["Completado"];
    const porcentaje =
      TOTAL_CONTROLES === 0
        ? 0
        : Math.round((cumplidos / TOTAL_CONTROLES) * 100);

    return {
      empresa_id: empresaId,
      total_controles: TOTAL_CONTROLES,
      evaluados,
      porcentaje_cumplimiento: porcentaje,
      por_estado: conteo,
      grafica: Object.entries(conteo).map(([estado, cantidad]) => ({
        estado,
        cantidad,
      })),
    };
  }

  async getGapAnalysis(empresaId) {
    const ultimosSeguimientos =
      await this.getUltimosSeguimientosPorControl(empresaId);

    const noCumple = ultimosSeguimientos.filter(
      (s) => s.estados_de_control?.nombre_del_estado === "Pendiente Novedad",
    );

    const todosLosControles = await this.controlRepository.findAll();
    const controlesConSeguimiento = new Set(
      ultimosSeguimientos.map((s) => s.control_id),
    );
    const sinIniciar = todosLosControles.filter(
      (c) => !controlesConSeguimiento.has(c.id_control_maestro),
    );

    return {
      total_gaps: noCumple.length + sinIniciar.length,
      no_cumple: noCumple.map((s) => ({
        id_seguimiento: s.id_seguimiento,
        control: s.biblioteca_de_controles,
        responsable: s.nombre_del_responsable,
        justificacion: s.descripcion_justificacion,
      })),
      sin_iniciar: sinIniciar.map((c) => ({
        control: c,
        estado: "No Iniciado",
      })),
    };
  }

  async getPorDominio(empresaId) {
    // 1. Obtener todos los controles maestros (sin filtro de empresa, asumiendo que son globales)
    const todosControles = await this.controlRepository.findAll();

    // 2. Extraer dominios únicos (valores reales de area_o_dominio)
    const dominiosReales = [
      ...new Set(todosControles.map((c) => c.area_o_dominio).filter(Boolean)),
    ];

    // 3. Obtener últimos seguimientos por control (sin duplicados)
    const ultimosSeguimientos =
      await this.getUltimosSeguimientosPorControl(empresaId);

    // 4. Mapa para agrupar controles por dominio (basado en controles maestros)
    const controlesPorDominio = new Map();
    for (const control of todosControles) {
      const dominio = control.area_o_dominio;
      if (!dominio) continue;
      if (!controlesPorDominio.has(dominio)) {
        controlesPorDominio.set(dominio, []);
      }
      controlesPorDominio.get(dominio).push(control.id_control_maestro);
    }

    // 5. Construir resultado para cada dominio real
    const resultado = {};
    for (const dominio of dominiosReales) {
      const idsControles = controlesPorDominio.get(dominio) || [];
      const total = idsControles.length;

      // Seguimientos que corresponden a este dominio (solo los últimos)
      const segsDelDominio = ultimosSeguimientos.filter((s) =>
        idsControles.includes(s.control_id),
      );

      const cumplidos = segsDelDominio.filter(
        (s) => s.estados_de_control?.nombre_del_estado === "Completado",
      ).length;

      resultado[dominio] = {
        total,
        evaluados: segsDelDominio.length,
        cumple: cumplidos,
        porcentaje: total === 0 ? 0 : Math.round((cumplidos / total) * 100),
      };
    }

    return resultado;
  }
}

module.exports = DashboardService;
