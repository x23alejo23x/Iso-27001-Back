// src/infrastructure/repositories/EvidenciaRepository.js
const IEvidenciaRepository = require('../../domain/repositories/IEvidenciaRepository');
const prisma = require('../database/prisma');

class EvidenciaRepository extends IEvidenciaRepository {
  async create(data) {
    return await prisma.evidencias_del_control.create({
      data,
      include: { usuarios: { select: { nombre_usuario: true } } },
    });
  }

  async findById(id) {
    return await prisma.evidencias_del_control.findUnique({
      where: { id_evidencia: id },
    });
  }

  async findBySeguimiento(seguimientoId) {
    return await prisma.evidencias_del_control.findMany({
      where: { seguimiento_id: seguimientoId },
      include: { usuarios: { select: { nombre_usuario: true } } },
      orderBy: { fecha_de_subida: 'desc' },
    });
  }

  async delete(id) {
    return await prisma.evidencias_del_control.delete({
      where: { id_evidencia: id },
    });
  }
}

module.exports = EvidenciaRepository;