class AnalisisIAController {
  constructor(analisisIAService) {
    this.analisisIAService = analisisIAService;
  }

  async analizarDocumento(req, res) {
    try {
      // Con multipart/form-data multer parsea el body así:
      const empresa_id = req.body?.empresa_id;
      const control_id = req.body?.control_id;

      if (!empresa_id || !control_id) {
        return res.status(400).json({
          message: "empresa_id y control_id son requeridos",
          recibido: { empresa_id, control_id }, // para debug
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Debes subir un archivo PDF" });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res
          .status(400)
          .json({ message: "Solo se permiten archivos PDF" });
      }

      const resultado = await this.analisisIAService.analizarDocumento({
        empresa_id,
        control_id,
        archivoBuffer: req.file.buffer,
      });

      res.json(resultado);
    } catch (error) {
      console.error("ERROR IA:", error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AnalisisIAController;
