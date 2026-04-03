// src/interfaces/controllers/EvidenciaController.js
class EvidenciaController {
  constructor(evidenciaService) {
    this.evidenciaService = evidenciaService;
  }

  async create(req, res) {
    try {
      const { empresa_id, usuario_que_subio_id, seguimiento_id, nombre_del_archivo, link_al_archivo } = req.body;
      if (!empresa_id || !seguimiento_id || !nombre_del_archivo || !link_al_archivo)
        return res.status(400).json({ message: 'empresa_id, seguimiento_id, nombre y link son requeridos' });

      const evidencia = await this.evidenciaService.create({
        seguimiento_id,
        nombre_del_archivo,
        link_al_archivo,
        usuario_que_subio_id,
        empresa_id,
      });
      res.status(201).json(evidencia);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getBySeguimiento(req, res) {
    try {
      const { seguimientoId } = req.params;
      const { empresa_id } = req.query;
      if (!empresa_id) return res.status(400).json({ message: 'empresa_id es requerido' });

      const evidencias = await this.evidenciaService.getBySeguimiento(seguimientoId, empresa_id);
      res.json(evidencias);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { empresa_id } = req.query;
      if (!empresa_id) return res.status(400).json({ message: 'empresa_id es requerido' });

      await this.evidenciaService.delete(id, empresa_id);
      res.json({ success: true, message: 'Evidencia eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = EvidenciaController;