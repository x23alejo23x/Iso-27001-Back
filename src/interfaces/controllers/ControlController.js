// src/interfaces/controllers/ControlController.js
class ControlController {
  constructor(controlService) {
    this.controlService = controlService;
  }

  async getAll(req, res) {
    try {
      const controles = await this.controlService.getAll();
      res.json(controles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async buscar(req, res) {
    try {
      const { area, tipo, q } = req.query;
      const controles = await this.controlService.buscar({ area, tipo, q });
      res.json(controles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

async getDetalle(req, res) {
  try {
    const { id } = req.params;
    const { empresa_id } = req.query;
    if (!empresa_id) {
      return res.status(400).json({ message: 'empresa_id es requerido' });
    }
    const detalle = await this.controlService.getDetalle(id, empresa_id);
    res.json(detalle);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
}

module.exports = ControlController;