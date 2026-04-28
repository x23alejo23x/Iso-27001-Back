const IAnalisisIARepository = require("../../domain/repositories/IAnalisisIARepository");
const SeguimientoRepository = require("./SeguimientoRepository");

class AnalisisIARepository extends IAnalisisIARepository {
  constructor() {
    super();
    this.seguimientoRepo = new SeguimientoRepository();
  }

  async guardarResultados(empresa_id, resultados) {
    const operaciones = resultados.map(async (r) => {
      const existente = await this.seguimientoRepo.findByControlAndEmpresa(
        r.control_id,
        empresa_id,
      );

      if (existente) {
        return this.seguimientoRepo.update(existente.id_seguimiento, {
          estado_sugerido_ia: r.estado_sugerido,
          justificacion_ia: r.justificacion,
          fecha_de_modificacion: new Date(),
        });
      } else {
        // Creamos el registro nuevo
        return this.seguimientoRepo.create({
          empresa_id,
          control_id: r.control_id,
          estado_sugerido_ia: r.estado_sugerido,
          justificacion_ia: r.justificacion,
          nombre_del_responsable: "Análisis IA",
        });
      }
    });

    return await Promise.all(operaciones);
  }
}

module.exports = AnalisisIARepository;
