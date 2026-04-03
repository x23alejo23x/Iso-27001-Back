// src/application/admin/AdminService.js
const bcrypt = require('bcrypt');

class AdminService {
  constructor(usuarioRepository, empresaRepository) {
    this.usuarioRepository = usuarioRepository;
    this.empresaRepository = empresaRepository;
  }

  async getEmpresa(empresaId) {
    const empresa = await this.empresaRepository.findById(empresaId);
    if (!empresa) throw new Error('Empresa no encontrada');
    return empresa;
  }

  async listarUsuarios(empresaId) {
    return await this.usuarioRepository.findByEmpresa(empresaId);
  }

  async crearUsuario({ nombre_usuario, correo_electronico, password, rol_id, empresa_id }) {
    const existe = await this.usuarioRepository.existeEmail(correo_electronico);
    if (existe) throw new Error('Correo ya registrado');

    const contrasena_encriptada = await bcrypt.hash(password, 10);
    const nuevo = await this.usuarioRepository.create({
      nombre_usuario,
      correo_electronico,
      contrasena_encriptada,
      rol_id,
      empresa_id,
    });

    const { contrasena_encriptada: _, ...usuarioSinPass } = nuevo;
    return usuarioSinPass;
  }

  async editarUsuario(userId, empresaAdminId, datos) {
    const usuario = await this.usuarioRepository.findById(userId);
    if (!usuario || usuario.empresa_id !== empresaAdminId)
      throw new Error('Usuario no encontrado o no pertenece a su empresa');

    const actualizado = await this.usuarioRepository.update(userId, datos);
    const { contrasena_encriptada, ...usuarioSinPass } = actualizado;
    return usuarioSinPass;
  }
}

module.exports = AdminService;