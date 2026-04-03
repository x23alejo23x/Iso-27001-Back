// src/application/auth/AuthService.js
const LoginUseCase = require('../../domain/use-cases/LoginUseCase');
const bcrypt = require('bcrypt');

class AuthService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async login(email, password) {
    const useCase = new LoginUseCase(this.usuarioRepository);
    return useCase.execute(email, password);
  }

  async cambiarPassword(userId, passwordActual, passwordNueva) {
    const usuario = await this.usuarioRepository.findById(userId);
    if (!usuario) throw new Error('Usuario no encontrado');

    const esValida = await bcrypt.compare(passwordActual, usuario.contrasena_encriptada);
    if (!esValida) throw new Error('Contraseña actual incorrecta');

    const hash = await bcrypt.hash(passwordNueva, 10);
    await this.usuarioRepository.updatePassword(userId, hash);
    return { success: true };
  }

  async getPerfil(userId) {
    const usuario = await this.usuarioRepository.findById(userId);
    if (!usuario) throw new Error('Usuario no encontrado');
    const { contrasena_encriptada, ...perfil } = usuario;
    return perfil;
  }
}

module.exports = AuthService;