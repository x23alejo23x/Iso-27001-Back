class Seguimiento {
  constructor({ id_seguimiento, empresa_id, control_id, estado_id, nombre_del_responsable, quien_actualizo_id, fecha_de_modificacion, descripcion_justificacion }) {
    this.id_seguimiento = id_seguimiento;
    this.empresa_id = empresa_id;
    this.control_id = control_id;
    this.estado_id = estado_id;
    this.nombre_del_responsable = nombre_del_responsable;
    this.quien_actualizo_id = quien_actualizo_id;
    this.fecha_de_modificacion = fecha_de_modificacion;
    this.descripcion_justificacion = descripcion_justificacion;
  }
}
module.exports = Seguimiento;