// src/application/seguimiento/SeguimientoService.js

class SeguimientoService {
  constructor(seguimientoRepository, controlRepository) {
    this.seguimientoRepository = seguimientoRepository;
    this.controlRepository = controlRepository;
  }

  async create(data) {
    const control = await this.controlRepository.findById(data.control_id);
    if (!control) throw new Error('Control no encontrado');

    return await this.seguimientoRepository.create(data);
  }

  async update(id, data, empresaId) {
    const seguimiento = await this.seguimientoRepository.findById(id);
    if (!seguimiento || seguimiento.empresa_id !== empresaId)
      throw new Error('Seguimiento no encontrado o no pertenece a su empresa');

    return await this.seguimientoRepository.update(id, data);
  }

  async getByEmpresa(empresaId, estadoId = null) {
    return await this.seguimientoRepository.findByEmpresa(empresaId, estadoId);
  }

  async getResumen(empresaId) {
    const TOTAL_CONTROLES = 93;
    const seguimientos = await this.seguimientoRepository.findByEmpresa(empresaId);

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
        ? Math.round(((conteo.CUMPLE + conteo.NO_APLICA) / TOTAL_CONTROLES) * 100)
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