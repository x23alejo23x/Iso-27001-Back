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
}
module.exports = ControlController;