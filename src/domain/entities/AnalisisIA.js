class AnalisisIA {
  constructor({
    empresa_id,
    control_id,
    estado_sugerido,
    justificacion,
    nombre_responsable,
  }) {
    this.empresa_id = empresa_id;
    this.control_id = control_id;
    this.estado_sugerido = estado_sugerido; // "Cumple", "No Cumple", "Parcial"
    this.justificacion = justificacion;
    this.nombre_responsable = nombre_responsable || "Análisis IA";
  }
}
module.exports = AnalisisIA;
