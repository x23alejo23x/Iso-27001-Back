// src/interfaces/controllers/AuthController.js
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: 'Correo y contraseña requeridos' });

      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  }

  async cambiarPassword(req, res) {
    try {
      const { userId, passwordActual, passwordNueva } = req.body;
      if (!userId || !passwordActual || !passwordNueva)
        return res.status(400).json({ message: 'userId, contraseña actual y nueva son requeridos' });

      if (passwordNueva.length < 8 || !/\d/.test(passwordNueva))
        return res.status(400).json({
          message: 'La contraseña debe tener mínimo 8 caracteres y al menos 1 número',
        });

      await this.authService.cambiarPassword(userId, passwordActual, passwordNueva);
      res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = AuthController;