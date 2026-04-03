const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CONFIG = {
  controlesJsonPath: path.join(__dirname, '../data/controles_iso27001.json'),
  cleanBeforeImport: false
};

async function importarControles() {
  console.log('🚀 Importando controles desde JSON...');
  try {
    const data = JSON.parse(fs.readFileSync(CONFIG.controlesJsonPath, 'utf8'));
    const anexo = data.anexo_a;

    let totalControles = 0;

    for (const [codigo, dominio] of Object.entries(anexo.dominios)) {
      for (const control of dominio.controles) {
        await prisma.biblioteca_de_controles.upsert({
          where: { id_control_maestro: control.id_control },
          update: {
            nombre_del_control: control.nombre,
            explicacion_del_control: control.descripcion,
            area_o_dominio: codigo,
            tipo_control: control.categoria
          },
          create: {
            id_control_maestro: control.id_control,
            codigo_norma: control.id_control,
            nombre_del_control: control.nombre,
            explicacion_del_control: control.descripcion,
            area_o_dominio: codigo,
            tipo_control: control.categoria
          }
        });
        totalControles++;
      }
    }
    console.log(`✅ Importados ${totalControles} controles.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}
importarControles();