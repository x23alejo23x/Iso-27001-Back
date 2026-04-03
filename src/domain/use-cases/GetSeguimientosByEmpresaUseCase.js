class GetSeguimientosByEmpresaUseCase {
  constructor(seguimientoRepository) {
    this.seguimientoRepository = seguimientoRepository;
  }
  async execute(empresaId) {
    return await this.seguimientoRepository.findByEmpresa(empresaId);
  }
}
module.exports = GetSeguimientosByEmpresaUseCase;