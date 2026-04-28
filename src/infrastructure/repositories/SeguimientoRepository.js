// src/infrastructure/repositories/SeguimientoRepository.js
const ISeguimientoRepository = require("../../domain/repositories/ISeguimientoRepository");
const prisma = require("../database/prisma");

class SeguimientoRepository extends ISeguimientoRepository {
  async findByControlAndEmpresa(controlId, empresaId) {
    return await prisma.seguimiento_de_cumplimiento.findFirst({
      where: { control_id: controlId, empresa_id: empresaId },
      orderBy: { fecha_de_modificacion: "desc" },
    });
  }

  async findById(id) {
    return await prisma.seguimiento_de_cumplimiento.findUnique({
      where: { id_seguimiento: id },
    });
  }

  async update(id, data) {
    // Construir objeto con los nombres exactos del modelo
    const updateData = {
      estado_id: data.estado_id,
      nombre_del_responsable: data.nombre_del_responsable,
      descripcion_justificacion: data.descripcion_justificacion,
      quien_actualizo_id: data.quien_actualizo_id,
      fecha_de_modificacion: new Date(),
      Url_Evidencia: data.url_evidencia || null, // ← nombre correcto en BD
    };
    return await prisma.seguimiento_de_cumplimiento.update({
      where: { id_seguimiento: id },
      data: updateData,
      include: {
        biblioteca_de_controles: true,
        estados_de_control: true,
      },
    });
  }

  async create(data) {
    return await prisma.seguimiento_de_cumplimiento.create({
      data: {
        control_id: data.control_id,
        empresa_id: data.empresa_id,
        estado_id: data.estado_id,
        nombre_del_responsable: data.nombre_del_responsable,
        descripcion_justificacion: data.descripcion_justificacion,
        quien_actualizo_id: data.quien_actualizo_id,
        fecha_de_modificacion: new Date(),
        Url_Evidencia: data.url_evidencia || null, // ← agregado
      },
      include: {
        biblioteca_de_controles: true,
        estados_de_control: true,
      },
    });
  }

  // RF-SEG-005: con filtro opcional por estado
  async findByEmpresa(empresaId, estadoId = null) {
    const where = { empresa_id: empresaId };
    if (estadoId) where.estado_id = estadoId;

    return await prisma.seguimiento_de_cumplimiento.findMany({
      where,
      include: {
        biblioteca_de_controles: true,
        estados_de_control: true,
        usuarios: { select: { nombre_usuario: true } },
      },
      orderBy: { fecha_de_modificacion: "desc" },
    });
  }

  async findByEmpresaYControl(empresaId, controlId) {
    return await prisma.seguimiento_de_cumplimiento.findFirst({
      where: { empresa_id: empresaId, control_id: controlId },
      include: { estados_de_control: true },
    });
  }

  async findByControl(controlId) {
    return await prisma.seguimiento_de_cumplimiento.findMany({
      where: { control_id: controlId },
    });
  }

  // RF-SEG-003: historial de cambios
  async getHistorial(controlId, empresaId) {
    return await prisma.seguimiento_de_cumplimiento.findMany({
      where: { control_id: controlId, empresa_id: empresaId },
      include: {
        estados_de_control: true,
        usuarios: { select: { nombre_usuario: true } },
      },
      orderBy: { fecha_de_modificacion: "desc" },
      take: 10,
    });
  }

  async findCumplidosByEmpresa(empresaId) {
    return await prisma.seguimiento_de_cumplimiento.findMany({
      where: {
        empresa_id: empresaId,
        estado_id: 1,
      },
      include: {
        biblioteca_de_controles: true,
        estados_de_control: true,
        usuarios: { select: { nombre_usuario: true } },
      },
      orderBy: { fecha_de_modificacion: "desc" },
    });
  }
}

module.exports = SeguimientoRepository;
