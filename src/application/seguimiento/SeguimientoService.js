const UpdateSeguimientoUseCase = require('../../domain/use-cases/UpdateSeguimientoUseCase');
const GetSeguimientosByEmpresaUseCase = require('../../domain/use-cases/GetSeguimientosByEmpresaUseCase');
class SeguimientoService {
  constructor(seguimientoRepository, controlRepository, empresaRepository) {
    this.seguimientoRepository = seguimientoRepository;
    this.controlRepository = controlRepository;
    this.empresaRepository = empresaRepository;
  }
  async update(id, data, userId) {
    const useCase = new UpdateSeguimientoUseCase(this.seguimientoRepository, this.controlRepository, this.empresaRepository);
    return useCase.execute(id, data, userId);
  }
  async getByEmpresa(empresaId) {
    const useCase = new GetSeguimientosByEmpresaUseCase(this.seguimientoRepository);
    return useCase.execute(empresaId);
  }
}
module.exports = SeguimientoService;