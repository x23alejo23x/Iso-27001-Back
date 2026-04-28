const AnalizarDocumentoIAUseCase = require("../../domain/use-cases/AnalizarDocumentoIAUseCase");
const ControlRepository = require("../../infrastructure/repositories/ControlRepository");
const AnalisisIARepository = require("../../infrastructure/repositories/AnalisisIARepository");

class AnalisisIAService {
  constructor() {
    this.controlRepository = new ControlRepository();
    this.analisisIARepository = new AnalisisIARepository();
    this.useCase = new AnalizarDocumentoIAUseCase(
      this.controlRepository,
      this.analisisIARepository,
    );
  }

  async analizarDocumento({ empresa_id, control_id, archivoBuffer }) {
    return await this.useCase.execute({
      empresa_id,
      control_id,
      archivoBuffer,
    });
  }
}

module.exports = AnalisisIAService;
