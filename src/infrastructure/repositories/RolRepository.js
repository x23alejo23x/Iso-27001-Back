const IRolRepository = require('../../domain/repositories/IRolRepository');
const prisma = require('../database/prisma');
class RolRepository extends IRolRepository {
  async findAll() {
    return await prisma.roles_de_usuario.findMany();
  }
  async findById(id) {
    return await prisma.roles_de_usuario.findUnique({ where: { id_rol: id } });
  }
}
module.exports = RolRepository;