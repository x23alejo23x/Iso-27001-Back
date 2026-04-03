class UpdateSeguimientoUseCase {
  constructor(seguimientoRepository, controlRepository, empresaRepository) {
    this.seguimientoRepository = seguimientoRepository;
    this.controlRepository = controlRepository;
    this.empresaRepository = empresaRepository;
  }
  async execute(id, data, userId) {
    if (!data.estado_id) throw new Error('Estado es requerido');
    const seguimiento = await this.seguimientoRepository.update(id, { ...data, quien_actualizo_id: userId });
    return seguimiento;
  }
}
module.exports = UpdateSeguimientoUseCase;