class IUsuarioRepository {
  async findById(id) {
    throw new Error("Method not implemented");
  }
  async findByEmail(email) {
    throw new Error("Method not implemented");
  }
  async findByEmpresa(empresaId) {
    throw new Error("Method not implemented");
  }
  async create(data) {
    throw new Error("Method not implemented");
  }
  async update(id, data) {
    throw new Error("Method not implemented");
  }
  async updatePassword(id, hashedPassword) {
    throw new Error("Method not implemented");
  }
  async existeEmail(email) {
    throw new Error("Method not implemented");
  }
  async eliminarUsuario(id, empresa_id) {
    throw new Error("Method not implemented");
  }

  async listarDepartamentos(empresaId) {
    throw new Error("Method not implemented");
  }
  async crearDepartamento(data) {
    throw new Error("Method not implemented");
  }
  async actualizarDepartamento(id, data) {
    throw new Error("Method not implemented");
  }
  async eliminarDepartamento(id, empresaId) {
    throw new Error("Method not implemented");
  }
  async asignarDepartamento(usuarioId, departamentoId) {
    throw new Error("Method not implemented");
  }
}

module.exports = IUsuarioRepository;
