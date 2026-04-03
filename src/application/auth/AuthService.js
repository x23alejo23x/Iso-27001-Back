const LoginUseCase = require('../../domain/use-cases/LoginUseCase');
class AuthService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }
  async login(email, password) {
    const useCase = new LoginUseCase(this.usuarioRepository);
    return useCase.execute(email, password);
  }
}
module.exports = AuthService;