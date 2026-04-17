// src/application/seguimiento/SeguimientoService.js

class SeguimientoService {
  constructor(seguimientoRepository, controlRepository) {
    this.seguimientoRepository = seguimientoRepository;
    this.controlRepository = controlRepository;
  }

  async upsert(data) {
    const existing = await this.seguimientoRepository.findByControlAndEmpresa(
      data.control_id,
      data.empresa_id,
    );

    if (existing && existing.estado_id === data.estado_id) {
      return existing;
    }
    return await this.seguimientoRepository.create({
      control_id: data.control_id,
      empresa_id: data.empresa_id,
      estado_id: data.estado_id,
      nombre_del_responsable: data.nombre_del_responsable,
      descripcion_justificacion: data.descripcion_justificacion,
      quien_actualizo_id: data.quien_actualizo_id,
    });
  }
  async update(id, data, empresaId) {
    const seguimiento = await this.seguimientoRepository.findById(id);
    if (!seguimiento || seguimiento.empresa_id !== empresaId)
      throw new Error("Seguimiento no encontrado o no pertenece a su empresa");

    return await this.seguimientoRepository.update(id, data);
  }

  async getByEmpresa(empresaId, estadoId = null) {
    const all = await this.seguimientoRepository.findByEmpresa(
      empresaId,
      estadoId,
    );
    const ultimos = new Map();
    for (const seg of all) {
      const controlId = seg.control_id;
      if (
        !ultimos.has(controlId) ||
        new Date(seg.fecha_de_modificacion) >
          new Date(ultimos.get(controlId).fecha_de_modificacion)
      ) {
        ultimos.set(controlId, seg);
      }
    }
    return Array.from(ultimos.values());
  }

  async getResumen(empresaId) {
    const TOTAL_CONTROLES = 93;
    const todos = await this.seguimientoRepository.findByEmpresa(empresaId);

    // Quedarse solo con el último registro por control
    const ultimosPorControl = new Map();
    for (const seg of todos) {
      const controlId = seg.control_id;
      if (
        !ultimosPorControl.has(controlId) ||
        new Date(seg.fecha_de_modificacion) >
          new Date(ultimosPorControl.get(controlId).fecha_de_modificacion)
      ) {
        ultimosPorControl.set(controlId, seg);
      }
    }

    const seguimientos = Array.from(ultimosPorControl.values());

    const conteo = {
      NO_INICIADO: 0,
      EN_PROCESO: 0,
      CUMPLE: 0,
      NO_CUMPLE: 0,
      NO_APLICA: 0,
    };

    seguimientos.forEach((s) => {
      const estado = s.estados_de_control?.nombre_del_estado;
      if (estado && conteo[estado] !== undefined) conteo[estado]++;
    });

    const evaluados = seguimientos.length;
    const sinRegistro = TOTAL_CONTROLES - evaluados;
    conteo.NO_INICIADO += sinRegistro;

    const porcentajeCumplimiento =
      evaluados > 0
        ? Math.round(
            ((conteo.CUMPLE + conteo.NO_APLICA) / TOTAL_CONTROLES) * 100,
          )
        : 0;

    return {
      total_controles: TOTAL_CONTROLES,
      evaluados,
      porcentaje_cumplimiento: porcentajeCumplimiento,
      por_estado: conteo,
    };
  }

  async getHistorial(controlId, empresaId) {
    return await this.seguimientoRepository.getHistorial(controlId, empresaId);
  }
}

module.exports = SeguimientoService;
