const PDF2Json = require("pdf2json");
const {
  analizarDocumentoControles,
} = require("../../infrastructure/services/OpenAIService");

async function extraerTextoPDF(buffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDF2Json();

    pdfParser.on("pdfParser_dataError", (err) => reject(err.parserError));

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const texto = pdfData.Pages.map((page) =>
        page.Texts.map((t) => decodeURIComponent(t.R[0].T)).join(" "),
      ).join("\n");
      resolve(texto);
    });

    pdfParser.parseBuffer(buffer);
  });
}

class AnalizarDocumentoIAUseCase {
  constructor(controlRepository, analisisIARepository) {
    this.controlRepository = controlRepository;
    this.analisisIARepository = analisisIARepository;
  }

  async execute({ empresa_id, control_id, archivoBuffer }) {
    // 1. Extraer texto del PDF
    const textoPDF = await extraerTextoPDF(archivoBuffer);

    if (!textoPDF || textoPDF.trim().length < 50) {
      throw new Error("El PDF no contiene texto legible suficiente");
    }

    // 2. Traer solo ese control por ID
    const control = await this.controlRepository.findById(control_id);

    if (!control) {
      throw new Error("Control no encontrado");
    }

    // 3. Llamar a OpenAI
    const resultado = await analizarDocumentoControles(textoPDF, control);

    // 4. Formatear toda la respuesta en un solo string para 'justificacion_ia'
    const textoCompletoIA = `
RESUMEN EJECUTIVO:
${resultado.resumen_ejecutivo}

CUMPLIMIENTO: ${resultado.nivel_cumplimiento_porcentaje}% | RIESGO: ${resultado.riesgo_incumplimiento}

JUSTIFICACIÓN TÉCNICA:
${resultado.justificacion}

ASPECTOS QUE CUMPLE:
${resultado.aspectos_que_cumple.map((i) => `- ${i}`).join("\n")}

ASPECTOS QUE FALTAN:
${resultado.aspectos_que_faltan.map((i) => `- ${i}`).join("\n")}

RECOMENDACIONES:
${resultado.recomendaciones.map((i) => `- ${i}`).join("\n")}

ANÁLISIS COMPARATIVO:
${resultado.analisis_comparativo
  .map(
    (i) => `* ${i.aspecto_evaluado}:
  - Norma: ${i.lo_que_exige_la_norma}
  - Documento: ${i.lo_que_dice_el_documento}`,
  )
  .join("\n")}
`.trim();

    // 5. Guardar en BD usando solo las columnas que sí tienes
    await this.analisisIARepository.guardarResultados(empresa_id, [
      {
        control_id,
        estado_sugerido: resultado.estado_sugerido,
        justificacion: textoCompletoIA, // Aquí va todo el bloque formateado
      },
    ]);

    // 6. Retornar respuesta estructurada para el frontend
    return {
      control: {
        id: control.id_control_maestro,
        codigo: control.codigo_norma,
        nombre: control.nombre_del_control,
        area: control.area_o_dominio,
      },
      estado_sugerido_ia: resultado.estado_sugerido,
      nivel_cumplimiento_porcentaje: resultado.nivel_cumplimiento_porcentaje,
      resumen_ejecutivo: resultado.resumen_ejecutivo,
      aspectos_que_cumple: resultado.aspectos_que_cumple,
      aspectos_que_faltan: resultado.aspectos_que_faltan,
      recomendaciones: resultado.recomendaciones,
      analisis_comparativo: resultado.analisis_comparativo,
      riesgo_incumplimiento: resultado.riesgo_incumplimiento,
      justificacion_ia: textoCompletoIA,
    };
  }
}

module.exports = AnalizarDocumentoIAUseCase;
