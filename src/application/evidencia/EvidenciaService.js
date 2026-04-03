// src/application/evidencia/EvidenciaService.js
class EvidenciaService {
  constructor(evidenciaRepository, seguimientoRepository) {
    this.evidenciaRepository = evidenciaRepository;
    this.seguimientoRepository = seguimientoRepository;
  }

  async create({ seguimiento_id, nombre_del_archivo, link_al_archivo, usuario_que_subio_id, empresa_id }) {
    const seguimiento = await this.seguimientoRepository.findById(seguimiento_id);
    if (!seguimiento || seguimiento.empresa_id !== empresa_id)
      throw new Error('Seguimiento no encontrado o no pertenece a su empresa');

    return await this.evidenciaRepository.create({
      seguimiento_id,
      nombre_del_archivo,
      link_al_archivo,
      usuario_que_subio_id,
    });
  }

  async getBySeguimiento(seguimientoId, empresaId) {
    const seguimiento = await this.seguimientoRepository.findById(seguimientoId);
    if (!seguimiento || seguimiento.empresa_id !== empresaId)
      throw new Error('Seguimiento no encontrado o no pertenece a su empresa');

    return await this.evidenciaRepository.findBySeguimiento(seguimientoId);
  }

  async delete(evidenciaId, empresaId) {
    const evidencia = await this.evidenciaRepository.findById(evidenciaId);
    if (!evidencia) throw new Error('Evidencia no encontrada');

    const seguimiento = await this.seguimientoRepository.findById(evidencia.seguimiento_id);
    if (!seguimiento || seguimiento.empresa_id !== empresaId)
      throw new Error('No tiene permiso para eliminar esta evidencia');

    return await this.evidenciaRepository.delete(evidenciaId);
  }
}

module.exports = EvidenciaService;