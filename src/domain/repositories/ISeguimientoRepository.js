class ISeguimientoRepository {
  async create(data) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async findByEmpresa(empresaId) { throw new Error('Not implemented'); }
  async findByControl(controlId) { throw new Error('Not implemented'); }
}
module.exports = ISeguimientoRepository;