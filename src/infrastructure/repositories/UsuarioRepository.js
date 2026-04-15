// src/infrastructure/repositories/UsuarioRepository.js
const IUsuarioRepository = require("../../domain/repositories/IUsuarioRepository");
const prisma = require("../database/prisma");

class UsuarioRepository extends IUsuarioRepository {
  // ============ MÉTODOS EXISTENTES ============
  async findByEmail(email) {
    return await prisma.usuarios.findUnique({
      where: { correo_electronico: email },
      include: { roles_de_usuario: true, empresas: true, departamento: true },
    });
  }

  async findById(id) {
    return await prisma.usuarios.findUnique({
      where: { id_usuario: id },
      include: { roles_de_usuario: true, empresas: true, departamento: true },
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
        departamento_id: true,
        departamento: {
          select: {
            id_departamento: true,
            nombre_departamento: true,
            descripcion: true,
          },
        },
        roles_de_usuario: { select: { nombre_del_rol: true } },
      },
    });
  }

  async create(data) {
    return await prisma.usuarios.create({
      data: {
        nombre_usuario: data.nombre_usuario,
        correo_electronico: data.correo_electronico,
        contrasena_encriptada: data.contrasena_encriptada,
        rol_id: data.rol_id,
        empresa_id: data.empresa_id,
        departamento_id: data.departamento_id || null,
      },
      include: { departamento: true, roles_de_usuario: true },
    });
  }

  async update(id, data) {
    return await prisma.usuarios.update({
      where: { id_usuario: id },
      data: {
        nombre_usuario: data.nombre_usuario,
        correo_electronico: data.correo_electronico,
        rol_id: data.rol_id,
        departamento_id: data.departamento_id,
      },
      include: { departamento: true },
    });
  }

  async updatePassword(id, hashedPassword) {
    return await prisma.usuarios.update({
      where: { id_usuario: id },
      data: { contrasena_encriptada: hashedPassword },
    });
  }

  async existeEmail(email) {
    const count = await prisma.usuarios.count({
      where: { correo_electronico: email },
    });
    return count > 0;
  }

  async eliminarUsuario(id, empresa_id) {
    const usuario = await prisma.usuarios.findFirst({
      where: { id_usuario: id, empresa_id: empresa_id },
    });
    if (!usuario)
      throw new Error("Usuario no encontrado o no pertenece a su empresa");
    await prisma.usuarios.delete({ where: { id_usuario: id } });
    return { message: "Usuario eliminado correctamente" };
  }

  // ============ NUEVOS MÉTODOS PARA DEPARTAMENTOS ============
  async listarDepartamentos(empresaId) {
    return await prisma.departamentos.findMany({
      where: { empresa_id: empresaId },
      orderBy: { nombre_departamento: "asc" },
      include: {
        _count: {
          select: { usuarios: true },
        },
      },
    });
  }

  async crearDepartamento(data) {
    return await prisma.departamentos.create({
      data: {
        empresa_id: data.empresa_id,
        nombre_departamento: data.nombre_departamento,
        descripcion: data.descripcion || null,
      },
    });
  }

  async actualizarDepartamento(id, data) {
    return await prisma.departamentos.update({
      where: { id_departamento: id },
      data: {
        nombre_departamento: data.nombre_departamento,
        descripcion: data.descripcion,
      },
    });
  }

  async eliminarDepartamento(id, empresaId) {
    // Verificar que el departamento pertenece a la empresa
    const departamento = await prisma.departamentos.findFirst({
      where: { id_departamento: id, empresa_id: empresaId },
      include: { _count: { select: { usuarios: true } } },
    });

    if (!departamento) throw new Error("Departamento no encontrado");
    if (departamento._count.usuarios > 0) {
      throw new Error(
        "No se puede eliminar un departamento con usuarios asignados",
      );
    }

    await prisma.departamentos.delete({ where: { id_departamento: id } });
    return { message: "Departamento eliminado correctamente" };
  }

  async asignarDepartamento(usuarioId, departamentoId) {
    return await prisma.usuarios.update({
      where: { id_usuario: usuarioId },
      data: { departamento_id: departamentoId },
      include: { departamento: true },
    });
  }
}

module.exports = UsuarioRepository;
