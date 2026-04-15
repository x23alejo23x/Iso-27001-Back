class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ message: "Correo y contraseña requeridos" });

      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  }

  async registrarEmpresa(req, res) {
    try {
      const { nombre_comercial, codigo_unico_url, administradores } = req.body;

      if (!nombre_comercial || !codigo_unico_url || !administradores) {
        return res.status(400).json({
          message:
            "Nombre comercial, código único y 2 administradores son requeridos",
        });
      }

      if (!Array.isArray(administradores) || administradores.length !== 2) {
        return res.status(400).json({
          message: "Debe proporcionar exactamente 2 administradores",
        });
      }

      for (let i = 0; i < administradores.length; i++) {
        const admin = administradores[i];
        if (
          !admin.nombre_usuario ||
          !admin.correo_electronico ||
          !admin.password
        ) {
          return res.status(400).json({
            message: `El administrador ${i + 1} debe tener nombre, email y contraseña`,
          });
        }
      }

      const result = await this.authService.registrarEmpresaConAdmins({
        nombre_comercial,
        codigo_unico_url,
        administradores,
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async cambiarPassword(req, res) {
    try {
      const { userId, passwordActual, passwordNueva } = req.body;
      if (!userId || !passwordActual || !passwordNueva)
        return res.status(400).json({
          message: "userId, contraseña actual y nueva son requeridos",
        });

      if (passwordNueva.length < 8 || !/\d/.test(passwordNueva))
        return res.status(400).json({
          message:
            "La contraseña debe tener mínimo 8 caracteres y al menos 1 número",
        });

      await this.authService.cambiarPassword(
        userId,
        passwordActual,
        passwordNueva,
      );
      res.json({
        success: true,
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
