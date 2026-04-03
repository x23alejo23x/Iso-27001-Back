// src/infrastructure/repositories/UsuarioRepository.js
const IUsuarioRepository = require('../../domain/repositories/IUsuarioRepository');
const prisma = require('../database/prisma');

class UsuarioRepository extends IUsuarioRepository {
  async findByEmail(email) {
    return await prisma.usuarios.findUnique({
      where: { correo_electronico: email },
      include: { roles_de_usuario: true, empresas: true },
    });
  }

  async findById(id) {
    return await prisma.usuarios.findUnique({
      where: { id_usuario: id },
      include: { roles_de_usuario: true, empresas: true },
    });
  }

  async findByEmpresa(empresaId) {
    return await prisma.usuarios.findMany({
      where: { empresa_id: empresaId },
      select: {
        id_usuario: true,
        nombre_usuario: true,
        correo_electronico: true,
        rol_id: true,
        fecha_registro: true,
        roles_de_usuario: { select: { nombre_del_rol: true } },
      },
    });
  }

  async create(data) {
    return await prisma.usuarios.create({ data });
  }

  async update(id, data) {
    return await prisma.usuarios.update({
      where: { id_usuario: id },
      data,
    });
  }

  async updatePassword(id, hashedPassword) {
    return await prisma.usuarios.update({
      where: { id_usuario: id },
      data: { contrasena_encriptada: hashedPassword },
    });
  }

  async existeEmail(email) {
    const count = await prisma.usuarios.count({ where: { correo_electronico: email } });
    return count > 0;
  }
}

module.exports = UsuarioRepository;