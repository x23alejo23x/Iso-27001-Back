class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email y contraseña requeridos' });
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}
module.exports = AuthController;