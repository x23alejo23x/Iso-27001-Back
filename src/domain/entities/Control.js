class Control {
  constructor({ id_control_maestro, codigo_norma, nombre_del_control, explicacion_del_control, area_o_dominio, tipo_control }) {
    this.id_control_maestro = id_control_maestro;
    this.codigo_norma = codigo_norma;
    this.nombre_del_control = nombre_del_control;
    this.explicacion_del_control = explicacion_del_control;
    this.area_o_dominio = area_o_dominio;
    this.tipo_control = tipo_control;
  }
}
module.exports = Control;