// src/infrastructure/repositories/EmpresaRepository.js
const IEmpresaRepository = require("../../domain/repositories/IEmpresaRepository");
const prisma = require("../database/prisma");

class EmpresaRepository extends IEmpresaRepository {
  async findById(id) {
    return await prisma.empresas.findUnique({ where: { id_empresa: id } });
  }

  async findByCodigo(codigo) {
    return await prisma.empresas.findUnique({
      where: { codigo_unico_url: codigo },
    });
  }

  async create(data) {
    return await prisma.empresas.create({
      data: {
        nombre_comercial: data.nombre_comercial,
        codigo_unico_url: data.codigo_unico_url,
      },
    });
  }

  async findAll() {
    return await prisma.empresas.findMany();
  }
}

module.exports = EmpresaRepository;
