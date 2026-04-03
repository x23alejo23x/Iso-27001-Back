const GetAllControlsUseCase = require('../../domain/use-cases/GetAllControlsUseCase');
class ControlService {
  constructor(controlRepository) {
    this.controlRepository = controlRepository;
  }
  async getAll() {
    const useCase = new GetAllControlsUseCase(this.controlRepository);
    return useCase.execute();
  }
}
module.exports = ControlService;