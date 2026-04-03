const bcrypt = require("bcrypt");

class LoginUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(email, password) {
      console.log('1. Buscando usuario con email:', email);

    const user = await this.usuarioRepository.findByEmail(email);
    if (!user) throw new Error("Credenciales inválidas");

    const isValid = await bcrypt.compare(password, user.contrasena_encriptada);
    if (!isValid) throw new Error("Credenciales inválidas");

    const { contrasena_encriptada, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  }
}

module.exports = LoginUseCase;
