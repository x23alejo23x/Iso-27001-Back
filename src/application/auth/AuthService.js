const LoginUseCase = require("../../domain/use-cases/LoginUseCase");
const bcrypt = require("bcrypt");

class AuthService {
  constructor(usuarioRepository, empresaRepository) {
    this.usuarioRepository = usuarioRepository;
    this.empresaRepository = empresaRepository;
  }

  async login(email, password) {
    const useCase = new LoginUseCase(this.usuarioRepository);
    return useCase.execute(email, password);
  }

  async registrarEmpresaConAdmins(data) {
    const { nombre_comercial, codigo_unico_url, administradores } = data;

    const empresaExistente =
      await this.empresaRepository.findByCodigo(codigo_unico_url);
    if (empresaExistente) {
      throw new Error("Ya existe una empresa con este código único");
    }

    for (const admin of administradores) {
      const usuarioExistente = await this.usuarioRepository.findByEmail(
        admin.correo_electronico,
      );
      if (usuarioExistente) {
        throw new Error(
          `El correo ${admin.correo_electronico} ya está registrado`,
        );
      }

      if (admin.password.length < 8 || !/\d/.test(admin.password)) {
        throw new Error(
          `La contraseña de ${admin.nombre_usuario} debe tener mínimo 8 caracteres y al menos 1 número`,
        );
      }
    }

    const nuevaEmpresa = await this.empresaRepository.create({
      nombre_comercial,
      codigo_unico_url,
    });

    const contrasena_suprema = await bcrypt.hash("Supremo2024!", 10);
    const adminSupremo = await this.usuarioRepository.create({
      nombre_usuario: `SUPREMO_${codigo_unico_url}`,
      correo_electronico: `supremo_${codigo_unico_url}@system.local`,
      contrasena_encriptada: contrasena_suprema,
      rol_id: 2,
      empresa_id: nuevaEmpresa.id_empresa,
    });

    const adminsCreados = [];
    for (const admin of administradores) {
      const contrasena_encriptada = await bcrypt.hash(admin.password, 10);
      const nuevoAdmin = await this.usuarioRepository.create({
        nombre_usuario: admin.nombre_usuario,
        correo_electronico: admin.correo_electronico,
        contrasena_encriptada,
        rol_id: 1,
        empresa_id: nuevaEmpresa.id_empresa,
      });

      const { contrasena_encriptada: _, ...adminSinPass } = nuevoAdmin;
      adminsCreados.push(adminSinPass);
    }

    return {
      success: true,
      empresa: {
        id: nuevaEmpresa.id_empresa,
        nombre_comercial: nuevaEmpresa.nombre_comercial,
        codigo_unico_url: nuevaEmpresa.codigo_unico_url,
      },
      administradores: adminsCreados,
      mensaje: "Empresa y administradores creados exitosamente",
    };
  }

  async cambiarPassword(userId, passwordActual, passwordNueva) {
    const usuario = await this.usuarioRepository.findById(userId);
    if (!usuario) throw new Error("Usuario no encontrado");

    const esValida = await bcrypt.compare(
      passwordActual,
      usuario.contrasena_encriptada,
    );
    if (!esValida) throw new Error("Contraseña actual incorrecta");

    const hash = await bcrypt.hash(passwordNueva, 10);
    await this.usuarioRepository.updatePassword(userId, hash);
    return { success: true };
  }

  async getPerfil(userId) {
    const usuario = await this.usuarioRepository.findById(userId);
    if (!usuario) throw new Error("Usuario no encontrado");
    const { contrasena_encriptada, ...perfil } = usuario;
    return perfil;
  }
}

module.exports = AuthService;
