class GetAllEstadosUseCase {
  constructor(estadoRepository) {
    this.estadoRepository = estadoRepository;
  }
  async execute() {
    return await this.estadoRepository.findAll();
  }
}
module.exports = GetAllEstadosUseCase;