const ISeguimientoRepository = require('../../domain/repositories/ISeguimientoRepository');
const prisma = require('../database/prisma');

class SeguimientoRepository extends ISeguimientoRepository {
  async create(data) {
    return await prisma.seguimiento_de_cumplimiento.create({ data });
  }

  async update(id, data) {
    return await prisma.seguimiento_de_cumplimiento.update({
      where: { id_seguimiento: id },
      data,
    });
  }

  async findByEmpresa(empresaId) {
    return await prisma.seguimiento_de_cumplimiento.findMany({
      where: { empresa_id: empresaId },
      include: {
        biblioteca_de_controles: true,   
        estados_de_control: true,        
      },
    });
  }

  async findByControl(controlId) {
    return await prisma.seguimiento_de_cumplimiento.findMany({
      where: { control_id: controlId },
    });
  }
}

module.exports = SeguimientoRepository;