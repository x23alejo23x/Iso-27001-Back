// src/infrastructure/repositories/ControlRepository.js
const IControlRepository = require('../../domain/repositories/IControlRepository');
const prisma = require('../database/prisma');

class ControlRepository extends IControlRepository {
  async findAll() {
    return await prisma.biblioteca_de_controles.findMany({
      orderBy: { codigo_norma: 'asc' },
    });
  }

  async findById(id) {
    return await prisma.biblioteca_de_controles.findUnique({
      where: { id_control_maestro: id },
    });
  }

  // RF-CTRL-002 + RF-CTRL-003: filtros por area, tipo y búsqueda libre
  async buscar({ area, tipo, q }) {
    const where = {};

    if (area) where.area_o_dominio = area;
    if (tipo) where.tipo_control = tipo;
    if (q && q.length >= 3) {
      where.OR = [
        { nombre_del_control: { contains: q, mode: 'insensitive' } },
        { codigo_norma: { contains: q, mode: 'insensitive' } },
      ];
    }

    return await prisma.biblioteca_de_controles.findMany({
      where,
      orderBy: { codigo_norma: 'asc' },
    });
  }

  async findByDominio(dominio) {
    return await prisma.biblioteca_de_controles.findMany({
      where: { area_o_dominio: dominio },
    });
  }
}

module.exports = ControlRepository;