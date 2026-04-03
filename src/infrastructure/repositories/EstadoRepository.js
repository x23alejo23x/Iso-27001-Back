const IEstadoRepository = require('../../domain/repositories/IEstadoRepository');
const prisma = require('../database/prisma');
class EstadoRepository extends IEstadoRepository {
  async findAll() {
    return await prisma.estados_de_control.findMany();
  }
  async findById(id) {
    return await prisma.estados_de_control.findUnique({ where: { id_estado: id } });
  }
  async findByNombre(nombre) {
    return await prisma.estados_de_control.findUnique({ where: { nombre_del_estado: nombre } });
  }
}
module.exports = EstadoRepository;