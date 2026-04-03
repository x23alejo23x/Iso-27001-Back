const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Roles
  const roles = [
    { nombre_del_rol: 'Administrador', descripcion_del_permiso: 'Acceso total al sistema y gestión de usuarios' },
    { nombre_del_rol: 'Auditor', descripcion_del_permiso: 'Puede evaluar controles y subir evidencias' },
    { nombre_del_rol: 'Consultor', descripcion_del_permiso: 'Puede editar pero con restricciones' },
    { nombre_del_rol: 'Visor', descripcion_del_permiso: 'Solo lectura de reportes' }
  ];
  for (const rol of roles) {
    await prisma.roles_de_usuario.upsert({
      where: { nombre_del_rol: rol.nombre_del_rol },
      update: {},
      create: rol,
    });
  }

  // Estados
  const estados = [
    { nombre_del_estado: 'NO_INICIADO', descripcion_del_estado: 'El control aún no ha sido revisado' },
    { nombre_del_estado: 'EN_PROCESO', descripcion_del_estado: 'Se está trabajando en la implementación del control' },
    { nombre_del_estado: 'CUMPLE', descripcion_del_estado: 'El control cumple satisfactoriamente con los requisitos' },
    { nombre_del_estado: 'NO_CUMPLE', descripcion_del_estado: 'El control no cumple o presenta fallas críticas' },
    { nombre_del_estado: 'NO_APLICA', descripcion_del_estado: 'Este control no es requerido para la naturaleza de esta empresa' }
  ];
  for (const estado of estados) {
    await prisma.estados_de_control.upsert({
      where: { nombre_del_estado: estado.nombre_del_estado },
      update: {},
      create: estado,
    });
  }

  // Empresa de prueba
  const empresa = await prisma.empresas.upsert({
    where: { codigo_unico_url: 'empresa-demo' },
    update: {},
    create: {
      nombre_comercial: 'Empresa Demo',
      codigo_unico_url: 'empresa-demo'
    }
  });

  // Usuario administrador
  await prisma.usuarios.upsert({
    where: { correo_electronico: 'admin@iso27001.com' },
    update: {},
    create: {
      nombre_usuario: 'admin',
      correo_electronico: 'admin@iso27001.com',
      contrasena_encriptada: await bcrypt.hash('admin123', 10),
      rol_id: 1,
      empresa_id: empresa.id_empresa
    }
  });

  console.log('✅ Datos iniciales insertados correctamente.');
}
main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
