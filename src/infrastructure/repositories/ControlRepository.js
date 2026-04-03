const IControlRepository = require('../../domain/repositories/IControlRepository');
const prisma = require('../database/prisma');
class ControlRepository extends IControlRepository {
  async findAll() {
    return await prisma.biblioteca_de_controles.findMany();
  }
  async findById(id) {
    return await prisma.biblioteca_de_controles.findUnique({ where: { id_control_maestro: id } });
  }
  async findByDominio(dominio) {
    return await prisma.biblioteca_de_controles.findMany({ where: { area_o_dominio: dominio } });
  }
}
module.exports = ControlRepository;