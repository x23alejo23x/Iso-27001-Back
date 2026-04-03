// src/application/dashboard/DashboardService.js
const prisma = require('../../infrastructure/database/prisma');

class DashboardService {
  constructor(seguimientoRepository, controlRepository) {
    this.seguimientoRepository = seguimientoRepository;
    this.controlRepository = controlRepository;
  }

  async getMetricas(empresaId) {
    const TOTAL_CONTROLES = 93;

    const seguimientos = await this.seguimientoRepository.findByEmpresa(empresaId);

    const conteo = { NO_INICIADO: 0, EN_PROCESO: 0, CUMPLE: 0, NO_CUMPLE: 0, NO_APLICA: 0 };
    seguimientos.forEach((s) => {
      const estado = s.estados_de_control?.nombre_del_estado;
      if (estado && conteo[estado] !== undefined) conteo[estado]++;
    });

    const sinRegistro = TOTAL_CONTROLES - seguimientos.length;
    conteo.NO_INICIADO += sinRegistro;

    const cumplidos = conteo.CUMPLE + conteo.NO_APLICA;
    const porcentaje = Math.round((cumplidos / TOTAL_CONTROLES) * 100);

    return {
      empresa_id: empresaId,
      total_controles: TOTAL_CONTROLES,
      evaluados: seguimientos.length,
      porcentaje_cumplimiento: porcentaje,
      por_estado: conteo,
      grafica: Object.entries(conteo).map(([estado, cantidad]) => ({ estado, cantidad })),
    };
  }

  async getGapAnalysis(empresaId) {
    const seguimientosNoCumple = await this.seguimientoRepository.findByEmpresa(empresaId, 4);

    const todosLosControles = await this.controlRepository.findAll();
    const controlesConSeguimiento = new Set(
      (await this.seguimientoRepository.findByEmpresa(empresaId)).map((s) => s.control_id)
    );
    const sinIniciar = todosLosControles.filter((c) => !controlesConSeguimiento.has(c.id_control_maestro));

    return {
      total_gaps: seguimientosNoCumple.length + sinIniciar.length,
      no_cumple: seguimientosNoCumple.map((s) => ({
        id_seguimiento: s.id_seguimiento,
        control: s.biblioteca_de_controles,
        responsable: s.nombre_del_responsable,
        justificacion: s.descripcion_justificacion,
      })),
      sin_iniciar: sinIniciar.map((c) => ({
        control: c,
        estado: 'NO_INICIADO',
      })),
    };
  }

  async getPorDominio(empresaId) {
    const dominios = ['Organizacionales', 'Personas', 'Fisicos', 'Tecnologicos'];
    const seguimientos = await this.seguimientoRepository.findByEmpresa(empresaId);

    const resultado = {};
    for (const dominio of dominios) {
      const controlesDelDominio = await this.controlRepository.buscar({ area: dominio });
      const ids = new Set(controlesDelDominio.map((c) => c.id_control_maestro));

      const segsDelDominio = seguimientos.filter((s) => ids.has(s.control_id));
      const cumple = segsDelDominio.filter(
        (s) => ['CUMPLE', 'NO_APLICA'].includes(s.estados_de_control?.nombre_del_estado)
      ).length;

      resultado[dominio] = {
        total: controlesDelDominio.length,
        evaluados: segsDelDominio.length,
        cumple,
        porcentaje: controlesDelDominio.length > 0
          ? Math.round((cumple / controlesDelDominio.length) * 100)
          : 0,
      };
    }

    return resultado;
  }
}

module.exports = DashboardService;