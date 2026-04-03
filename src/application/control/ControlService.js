// src/application/control/ControlService.js
const GetAllControlsUseCase = require('../../domain/use-cases/GetAllControlsUseCase');

class ControlService {
  constructor(controlRepository, seguimientoRepository) {
    this.controlRepository = controlRepository;
    this.seguimientoRepository = seguimientoRepository;
  }

  async getAll() {
    const useCase = new GetAllControlsUseCase(this.controlRepository);
    return useCase.execute();
  }

  async buscar({ area, tipo, q }) {
    return await this.controlRepository.buscar({ area, tipo, q });
  }

  async getDetalle(controlId, empresaId) {
    const control = await this.controlRepository.findById(controlId);
    if (!control) throw new Error('Control no encontrado');

    const seguimiento = await this.seguimientoRepository.findByEmpresaYControl(empresaId, controlId);

    return {
      ...control,
      seguimiento: seguimiento || null,
      estado_actual: seguimiento?.estados_de_control?.nombre_del_estado || 'NO_INICIADO',
    };
  }
}

module.exports = ControlService;