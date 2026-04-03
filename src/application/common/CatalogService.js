const GetAllRolesUseCase = require('../../domain/use-cases/GetAllRolesUseCase');
const GetAllEstadosUseCase = require('../../domain/use-cases/GetAllEstadosUseCase');
class CatalogService {
  constructor(rolRepository, estadoRepository) {
    this.rolRepository = rolRepository;
    this.estadoRepository = estadoRepository;
  }
  async getRoles() {
    const useCase = new GetAllRolesUseCase(this.rolRepository);
    return useCase.execute();
  }
  async getEstados() {
    const useCase = new GetAllEstadosUseCase(this.estadoRepository);
    return useCase.execute();
  }
}
module.exports = CatalogService;