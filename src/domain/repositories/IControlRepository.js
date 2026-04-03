class IControlRepository {
  async findAll() { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findByDominio(dominio) { throw new Error('Not implemented'); }
}
module.exports = IControlRepository;