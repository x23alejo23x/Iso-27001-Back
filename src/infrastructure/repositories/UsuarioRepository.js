const IUsuarioRepository = require('../../domain/repositories/IUsuarioRepository');
const prisma = require('../database/prisma');
class UsuarioRepository extends IUsuarioRepository {
  async findByEmail(email) {
    return await prisma.usuarios.findUnique({ where: { correo_electronico: email } });
  }
  async findById(id) {
    return await prisma.usuarios.findUnique({ where: { id_usuario: id } });
  }
}
module.exports = UsuarioRepository;