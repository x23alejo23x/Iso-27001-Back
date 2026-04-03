class CatalogController {
  constructor(catalogService) {
    this.catalogService = catalogService;
  }
  async getRoles(req, res) {
    try {
      const roles = await this.catalogService.getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getEstados(req, res) {
    try {
      const estados = await this.catalogService.getEstados();
      res.json(estados);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = CatalogController;