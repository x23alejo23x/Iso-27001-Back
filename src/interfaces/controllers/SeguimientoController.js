// src/interfaces/controllers/SeguimientoController.js
class SeguimientoController {
  constructor(seguimientoService) {
    this.seguimientoService = seguimientoService;
  }

  async upsert(req, res) {
    try {
      const { controlId } = req.params;
      const {
        empresa_id,
        quien_actualizo_id,
        estado_id,
        nombre_del_responsable,
        descripcion_justificacion,
        url_evidencia,
      } = req.body;

      if (!empresa_id || !quien_actualizo_id || !controlId || !estado_id) {
        return res.status(400).json({
          message:
            "empresa_id, controlId, quien_actualizo_id y estado_id son requeridos",
        });
      }

      const result = await this.seguimientoService.upsert({
        control_id: controlId,
        empresa_id,
        estado_id: Number(estado_id),
        nombre_del_responsable,
        descripcion_justificacion,
        quien_actualizo_id,
        url_evidencia,
      });

      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByEmpresa(req, res) {
    try {
      const { empresa_id, estado_id } = req.query;
      if (!empresa_id)
        return res.status(400).json({ message: "empresa_id es requerido" });

      const seguimientos = await this.seguimientoService.getByEmpresa(
        empresa_id,
        estado_id ? Number(estado_id) : null,
      );
      res.json(seguimientos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getResumen(req, res) {
    try {
      const { empresa_id } = req.query;
      if (!empresa_id)
        return res.status(400).json({ message: "empresa_id es requerido" });

      const resumen = await this.seguimientoService.getResumen(empresa_id);
      res.json(resumen);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getHistorial(req, res) {
    try {
      const { controlId } = req.params;
      const { empresa_id } = req.query;
      if (!empresa_id)
        return res.status(400).json({ message: "empresa_id es requerido" });

      const historial = await this.seguimientoService.getHistorial(
        controlId,
        empresa_id,
      );
      res.json(historial);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = SeguimientoController;
