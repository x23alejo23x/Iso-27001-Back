// src/interfaces/controllers/SeguimientoController.js
class SeguimientoController {
  constructor(seguimientoService) {
    this.seguimientoService = seguimientoService;
  }

  async create(req, res) {
    try {
      const { empresa_id, quien_actualizo_id, control_id, estado_id, nombre_del_responsable, descripcion_justificacion } = req.body;

      if (!empresa_id || !quien_actualizo_id || !control_id || !estado_id)
        return res.status(400).json({ message: 'empresa_id, quien_actualizo_id, control_id y estado_id son requeridos' });

      const result = await this.seguimientoService.create({
        control_id,
        estado_id: Number(estado_id),
        nombre_del_responsable,
        descripcion_justificacion,
        empresa_id,
        quien_actualizo_id,
      });

      res.status(201).json(result);
    } catch (error) {
      if (error.message?.includes('Unique constraint'))
        return res.status(409).json({ message: 'Este control ya tiene seguimiento en tu empresa' });
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { empresa_id, quien_actualizo_id, estado_id, descripcion_justificacion, nombre_del_responsable } = req.body;

      if (!empresa_id) return res.status(400).json({ message: 'empresa_id es requerido' });

      const result = await this.seguimientoService.update(id, {
        estado_id: estado_id ? Number(estado_id) : undefined,
        descripcion_justificacion,
        nombre_del_responsable,
        quien_actualizo_id,
        fecha_de_modificacion: new Date(),
      }, empresa_id);

      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByEmpresa(req, res) {
    try {
      const { empresa_id, estado_id } = req.query;
      if (!empresa_id) return res.status(400).json({ message: 'empresa_id es requerido' });

      const seguimientos = await this.seguimientoService.getByEmpresa(
        empresa_id,
        estado_id ? Number(estado_id) : null
      );
      res.json(seguimientos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getResumen(req, res) {
    try {
      const { empresa_id } = req.query;
      if (!empresa_id) return res.status(400).json({ message: 'empresa_id es requerido' });

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
      if (!empresa_id) return res.status(400).json({ message: 'empresa_id es requerido' });

      const historial = await this.seguimientoService.getHistorial(controlId, empresa_id);
      res.json(historial);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = SeguimientoController;