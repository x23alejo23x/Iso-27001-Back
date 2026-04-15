// src/interfaces/controllers/AdminController.js
class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  async getEmpresa(req, res) {
    try {
      const { empresa_id } = req.query;
      if (!empresa_id)
        return res.status(400).json({ message: "empresa_id es requerido" });
      const empresa = await this.adminService.getEmpresa(empresa_id);
      res.json(empresa);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async listarUsuarios(req, res) {
    try {
      const { empresa_id } = req.query;
      if (!empresa_id)
        return res.status(400).json({ message: "empresa_id es requerido" });
      const usuarios = await this.adminService.listarUsuarios(empresa_id);
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async crearUsuario(req, res) {
    try {
      const {
        empresa_id,
        nombre_usuario,
        correo_electronico,
        password,
        rol_id,
      } = req.body;
      if (
        !empresa_id ||
        !nombre_usuario ||
        !correo_electronico ||
        !password ||
        !rol_id
      )
        return res
          .status(400)
          .json({ message: "Todos los campos son requeridos" });

      if (![2, 3].includes(Number(rol_id)))
        return res.status(400).json({
          message:
            "Rol inválido. Solo se puede asignar Auditor (2) o Visor (3)",
        });

      if (password.length < 8 || !/\d/.test(password))
        return res.status(400).json({
          message:
            "La contraseña debe tener mínimo 8 caracteres y al menos 1 número",
        });

      const usuario = await this.adminService.crearUsuario({
        nombre_usuario,
        correo_electronico,
        password,
        rol_id: Number(rol_id),
        empresa_id,
      });
      res.status(201).json(usuario);
    } catch (error) {
      if (error.message === "Correo ya registrado")
        return res.status(409).json({ message: error.message });
      res.status(500).json({ message: error.message });
    }
  }

  async editarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { empresa_id, nombre_usuario, rol_id } = req.body;

      if (!empresa_id)
        return res.status(400).json({ message: "empresa_id es requerido" });

      if (rol_id && Number(rol_id) === 1) {
        return res.status(403).json({
          message: "No tiene permisos para asignar el rol de Administrador",
        });
      }

      const usuario = await this.adminService.editarUsuario(id, empresa_id, {
        nombre_usuario,
        rol_id: rol_id ? Number(rol_id) : undefined,
      });

      res.json(usuario);
    } catch (error) {
      if (error.message === "Usuario no encontrado o no pertenece a su empresa")
        return res.status(404).json({ message: error.message });

      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AdminController;
