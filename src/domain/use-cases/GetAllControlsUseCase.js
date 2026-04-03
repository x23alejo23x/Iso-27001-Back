class GetAllControlsUseCase {
  constructor(controlRepository) {
    this.controlRepository = controlRepository;
  }
  async execute() {
    return await this.controlRepository.findAll();
  }
}
module.exports = GetAllControlsUseCase;