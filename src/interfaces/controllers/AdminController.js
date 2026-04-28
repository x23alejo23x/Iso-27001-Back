// src/interfaces/controllers/AdminController.js
class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  // ============ MÉTODOS EXISTENTES ============
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
        departamento_id,
      } = req.body;
      if (
        !empresa_id ||
        !nombre_usuario ||
        !correo_electronico ||
        !password ||
        !rol_id
      ) {
        return res
          .status(400)
          .json({ message: "Todos los campos son requeridos" });
      }

      if (![3, 4].includes(Number(rol_id))) {
        return res.status(400).json({
          message:
            "Rol inválido. Solo se puede asignar Auditor (3) o Visor (4)",
        });
      }

      if (password.length < 8 || !/\d/.test(password)) {
        return res.status(400).json({
          message:
            "La contraseña debe tener mínimo 8 caracteres y al menos 1 número",
        });
      }

      const usuario = await this.adminService.crearUsuario({
        nombre_usuario,
        correo_electronico,
        password,
        rol_id: Number(rol_id),
        empresa_id,
        departamento_id,
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
      const { empresa_id, nombre_usuario, rol_id, departamento_id } = req.body;

      if (!empresa_id)
        return res.status(400).json({ message: "empresa_id es requerido" });

      // if (rol_id && (Number(rol_id) === 1 || Number(rol_id) === 2)) {
      //   return res.status(403).json({
      //     message:
      //       "No tiene permisos para asignar roles de Administrador o Administrador Supremo",
      //   });
      // }

      const usuario = await this.adminService.editarUsuario(id, empresa_id, {
        nombre_usuario,
        rol_id: rol_id ? Number(rol_id) : undefined,
        departamento_id,
      });

      res.json(usuario);
    } catch (error) {
      if (error.message === "Usuario no encontrado o no pertenece a su empresa")
        return res.status(404).json({ message: error.message });
      res.status(500).json({ message: error.message });
    }
  }

  async actualizarFechasEmpresa(req, res) {
    try {
      const { empresa_id, fecha_inicio, fecha_fin } = req.body;
      if (!empresa_id) {
        return res.status(400).json({ message: "empresa_id es requerido" });
      }

      if (fecha_inicio && isNaN(new Date(fecha_inicio).getTime())) {
        return res.status(400).json({ message: "fecha_inicio no es válida" });
      }
      if (fecha_fin && isNaN(new Date(fecha_fin).getTime())) {
        return res.status(400).json({ message: "fecha_fin no es válida" });
      }

      const empresaActualizada =
        await this.adminService.actualizarFechasEmpresa(
          empresa_id,
          fecha_inicio,
          fecha_fin,
        );
      res.json(empresaActualizada);
    } catch (error) {
      if (error.message === "Empresa no encontrada") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes("fecha")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
  async eliminarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { empresa_id } = req.query;
      if (!empresa_id)
        return res.status(400).json({ message: "empresa_id es requerido" });
      const result = await this.adminService.eliminarUsuario(id, empresa_id);
      res.json(result);
    } catch (error) {
      if (error.message === "Usuario no encontrado o no pertenece a su empresa")
        return res.status(404).json({ message: error.message });
      res.status(500).json({ message: error.message });
    }
  }

  // ============ NUEVOS MÉTODOS PARA DEPARTAMENTOS ============
  async listarDepartamentos(req, res) {
    try {
      const { empresa_id } = req.query;
      if (!empresa_id)
        return res.status(400).json({ message: "empresa_id es requerido" });
      const departamentos =
        await this.adminService.listarDepartamentos(empresa_id);
      res.json(departamentos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async crearDepartamento(req, res) {
    try {
      const { empresa_id, nombre_departamento, descripcion } = req.body;
      if (!empresa_id || !nombre_departamento) {
        return res
          .status(400)
          .json({ message: "empresa_id y nombre_departamento son requeridos" });
      }
      const departamento = await this.adminService.crearDepartamento(
        empresa_id,
        {
          nombre_departamento,
          descripcion,
        },
      );
      res.status(201).json(departamento);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async eliminarDepartamento(req, res) {
    try {
      const { id } = req.params;
      const { empresa_id } = req.query;
      if (!empresa_id)
        return res.status(400).json({ message: "empresa_id es requerido" });

      const result = await this.adminService.eliminarDepartamento(
        id,
        empresa_id,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = AdminController;
