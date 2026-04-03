class Evidencia {
  constructor({ id_evidencia, seguimiento_id, nombre_del_archivo, link_al_archivo, usuario_que_subio_id, fecha_de_subida }) {
    this.id_evidencia = id_evidencia;
    this.seguimiento_id = seguimiento_id;
    this.nombre_del_archivo = nombre_del_archivo;
    this.link_al_archivo = link_al_archivo;
    this.usuario_que_subio_id = usuario_que_subio_id;
    this.fecha_de_subida = fecha_de_subida;
  }
}
module.exports = Evidencia;