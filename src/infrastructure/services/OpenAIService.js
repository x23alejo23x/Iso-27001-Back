const OpenAI = require("openai");
const env = require("../../config/env");

async function analizarDocumentoControles(textoPDF, control) {
  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });

  const prompt = `
Eres un auditor senior certificado en ISO/IEC 27001 con más de 10 años de experiencia evaluando Sistemas de Gestión de Seguridad de la Información (SGSI).

Se te proporciona el contenido de un documento corporativo y un control específico de la norma ISO 27001. Tu tarea es hacer una auditoría profesional y detallada.

═══════════════════════════════════════
CONTROL ISO 27001 A EVALUAR
═══════════════════════════════════════
- Código:      ${control.codigo_norma}
- Nombre:      ${control.nombre_del_control}
- Descripción: ${control.explicacion_del_control || "N/A"}
- Área/Dominio: ${control.area_o_dominio || "N/A"}
- Tipo de control: ${control.tipo_control || "N/A"}
- Prioridad:   ${control.prioridad || "Media"}

═══════════════════════════════════════
DOCUMENTO A AUDITAR
═══════════════════════════════════════
${textoPDF.substring(0, 12000)}

═══════════════════════════════════════
INSTRUCCIONES DE ANÁLISIS
═══════════════════════════════════════
Analiza exhaustivamente el documento contra el control indicado y responde ÚNICAMENTE con un JSON válido con esta estructura exacta, sin texto adicional, sin markdown, sin bloques de código:

{
  "estado_sugerido": "Cumple" | "No Cumple" | "Parcial",
  "resumen_ejecutivo": "<2-3 oraciones que resumen el veredicto de forma clara y profesional>",
  "nivel_cumplimiento_porcentaje": <número entre 0 y 100>,
  "aspectos_que_cumple": [
    "<aspecto concreto del documento que evidencia cumplimiento del control>",
    "<otro aspecto concreto>"
  ],
  "aspectos_que_faltan": [
    "<brecha o deficiencia concreta que el documento no cubre del control>",
    "<otra brecha concreta>"
  ],
  "recomendaciones": [
    "<acción concreta y específica que la empresa debe tomar para mejorar el cumplimiento>",
    "<otra acción concreta>"
  ],
   "analisis_comparativo": [
    {
      "aspecto_evaluado": "<requisito específico del control que se compara, ej: 'Clasificación de activos'>",
      "lo_que_exige_la_norma": "<qué exige exactamente ISO 27001 en este aspecto según la descripción del control>",
      "lo_que_dice_el_documento": "<qué menciona o no menciona el documento cargado sobre este aspecto>",
      }
  ],
  "riesgo_incumplimiento": "Alto" | "Medio" | "Bajo",
  "justificacion": "<justificación técnica detallada de 3-5 oraciones explicando el veredicto>"
}

REGLAS:
- Si el documento no menciona nada relacionado al control, estado_sugerido debe ser "No Cumple" y nivel_cumplimiento_porcentaje debe ser 0.
- Si cumple todos los requisitos del control, nivel_cumplimiento_porcentaje debe ser entre 85 y 100.
- Si cumple parcialmente, nivel_cumplimiento_porcentaje debe ser entre 20 y 84.
- Los arrays pueden tener entre 1 y 7 elementos cada uno.
- Si no hay evidencias encontradas, retorna un array vacío [].
- Sé específico y técnico, no genérico.
`;

  const response = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1, // muy bajo para máxima precisión y consistencia
  });

  const content = response.choices[0].message.content;
  const clean = content.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

module.exports = { analizarDocumentoControles };

module.exports = { analizarDocumentoControles };
