// src/interfaces/controllers/DashboardController.js
class DashboardController {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
  }

  async getMetricas(req, res) {
    try {
      const { empresa_id } = req.query;
      if (!empresa_id) return res.status(400).json({ message: 'empresa_id es requerido' });
      const metricas = await this.dashboardService.getMetricas(empresa_id);
      res.json(metricas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getGapAnalysis(req, res) {
    try {
      const { empresa_id } = req.query;
      if (!empresa_id) return res.status(400).json({ message: 'empresa_id es requerido' });
      const gaps = await this.dashboardService.getGapAnalysis(empresa_id);
      res.json(gaps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getPorDominio(req, res) {
    try {
      const { empresa_id } = req.query;
      if (!empresa_id) return res.status(400).json({ message: 'empresa_id es requerido' });
      const data = await this.dashboardService.getPorDominio(empresa_id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = DashboardController;