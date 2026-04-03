class Empresa {
  constructor({ id_empresa, nombre_comercial, codigo_unico_url, fecha_de_registro }) {
    this.id_empresa = id_empresa;
    this.nombre_comercial = nombre_comercial;
    this.codigo_unico_url = codigo_unico_url;
    this.fecha_de_registro = fecha_de_registro;
  }
}
module.exports = Empresa;