class SeguimientoController {
  constructor(seguimientoService) {
    this.seguimientoService = seguimientoService;
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user.id;
      const result = await this.seguimientoService.update(id, data, userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async getByEmpresa(req, res) {
    try {
      const { empresaId } = req.params;
      const seguimientos = await this.seguimientoService.getByEmpresa(empresaId);
      res.json(seguimientos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = SeguimientoController;