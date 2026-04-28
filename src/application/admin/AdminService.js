// src/application/admin/AdminService.js
const bcrypt = require("bcrypt");

class AdminService {
  constructor(usuarioRepository, empresaRepository) {
    this.usuarioRepository = usuarioRepository;
    this.empresaRepository = empresaRepository;
  }

  // ============ MÉTODOS EXISTENTES ============
  async getEmpresa(empresaId) {
    const empresa = await this.empresaRepository.findById(empresaId);
    if (!empresa) throw new Error("Empresa no encontrada");
    return empresa;
  }

  async listarUsuarios(empresaId) {
    return await this.usuarioRepository.findByEmpresa(empresaId);
  }

  async crearUsuario({
    nombre_usuario,
    correo_electronico,
    password,
    rol_id,
    empresa_id,
    departamento_id,
  }) {
    const existe = await this.usuarioRepository.existeEmail(correo_electronico);
    if (existe) throw new Error("Correo ya registrado");

    const contrasena_encriptada = await bcrypt.hash(password, 10);
    const nuevo = await this.usuarioRepository.create({
      nombre_usuario,
      correo_electronico,
      contrasena_encriptada,
      rol_id,
      empresa_id,
      departamento_id,
    });

    const { contrasena_encriptada: _, ...usuarioSinPass } = nuevo;
    return usuarioSinPass;
  }

  async editarUsuario(userId, empresaAdminId, datos) {
    const usuario = await this.usuarioRepository.findById(userId);
    if (!usuario || usuario.empresa_id !== empresaAdminId)
      throw new Error("Usuario no encontrado o no pertenece a su empresa");

    const actualizado = await this.usuarioRepository.update(userId, datos);
    const { contrasena_encriptada, ...usuarioSinPass } = actualizado;
    return usuarioSinPass;
  }

  async eliminarUsuario(id, empresa_id) {
    return await this.usuarioRepository.eliminarUsuario(id, empresa_id);
  }

  // ============ NUEVOS MÉTODOS PARA DEPARTAMENTOS ============
  async listarDepartamentos(empresaId) {
    return await this.usuarioRepository.listarDepartamentos(empresaId);
  }

  async crearDepartamento(empresaId, data) {
    const { nombre_departamento, descripcion } = data;

    // Validar que no exista un departamento con el mismo nombre en la empresa
    const departamentos =
      await this.usuarioRepository.listarDepartamentos(empresaId);
    const existe = departamentos.some(
      (d) => d.nombre_departamento === nombre_departamento,
    );
    if (existe) throw new Error("Ya existe un departamento con ese nombre");

    return await this.usuarioRepository.crearDepartamento({
      empresa_id: empresaId,
      nombre_departamento,
      descripcion,
    });
  }
  async actualizarFechasEmpresa(empresaId, fecha_inicio, fecha_fin) {
    const empresa = await this.empresaRepository.findById(empresaId);
    if (!empresa) throw new Error("Empresa no encontrada");

    if (fecha_inicio && fecha_fin) {
      const inicio = new Date(fecha_inicio);
      const fin = new Date(fecha_fin);
      if (inicio > fin) {
        throw new Error(
          "La fecha de inicio no puede ser posterior a la fecha de fin",
        );
      }
    }

    return await this.empresaRepository.updateFechas(
      empresaId,
      fecha_inicio,
      fecha_fin,
    );
  }

  async actualizarDepartamento(departamentoId, empresaId, data) {
    // Verificar que el departamento pertenece a la empresa
    const departamentos =
      await this.usuarioRepository.listarDepartamentos(empresaId);
    const existe = departamentos.some(
      (d) => d.id_departamento === departamentoId,
    );
    if (!existe) throw new Error("Departamento no encontrado");

    return await this.usuarioRepository.actualizarDepartamento(
      departamentoId,
      data,
    );
  }

  async eliminarDepartamento(departamentoId, empresaId) {
    return await this.usuarioRepository.eliminarDepartamento(
      departamentoId,
      empresaId,
    );
  }

  async asignarDepartamento(usuarioId, departamentoId, empresaId) {
    // Verificar que el usuario pertenece a la empresa
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario || usuario.empresa_id !== empresaId)
      throw new Error("Usuario no encontrado o no pertenece a su empresa");

    // Verificar que el departamento pertenece a la empresa
    const departamentos =
      await this.usuarioRepository.listarDepartamentos(empresaId);
    const departamentoExiste = departamentos.some(
      (d) => d.id_departamento === departamentoId,
    );
    if (departamentoId && !departamentoExiste)
      throw new Error("Departamento no encontrado");

    return await this.usuarioRepository.asignarDepartamento(
      usuarioId,
      departamentoId || null,
    );
  }
}

module.exports = AdminService;
