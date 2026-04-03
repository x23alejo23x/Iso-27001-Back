class GetAllRolesUseCase {
  constructor(rolRepository) {
    this.rolRepository = rolRepository;
  }
  async execute() {
    return await this.rolRepository.findAll();
  }
}
module.exports = GetAllRolesUseCase;