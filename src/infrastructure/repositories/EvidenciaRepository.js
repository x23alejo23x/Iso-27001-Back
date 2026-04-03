const IEvidenciaRepository = require('../../domain/repositories/IEvidenciaRepository');
const prisma = require('../database/prisma');
class EvidenciaRepository extends IEvidenciaRepository {
  async create(data) {
    return await prisma.evidencias_del_control.create({ data });
  }
  async findBySeguimiento(seguimientoId) {
    return await prisma.evidencias_del_control.findMany({ where: { seguimiento_id: seguimientoId } });
  }
  async delete(id) {
    return await prisma.evidencias_del_control.delete({ where: { id_evidencia: id } });
  }
}
module.exports = EvidenciaRepository;