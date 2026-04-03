class Usuario {
  constructor({ id_usuario, empresa_id, rol_id, nombre_usuario, correo_electronico, contrasena_encriptada, fecha_registro }) {
    this.id_usuario = id_usuario;
    this.empresa_id = empresa_id;
    this.rol_id = rol_id;
    this.nombre_usuario = nombre_usuario;
    this.correo_electronico = correo_electronico;
    this.contrasena_encriptada = contrasena_encriptada;
    this.fecha_registro = fecha_registro;
  }
}
module.exports = Usuario;