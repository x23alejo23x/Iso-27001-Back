// src/infrastructure/repositories/EmpresaRepository.js
const IEmpresaRepository = require('../../domain/repositories/IEmpresaRepository');
const prisma = require('../database/prisma');

class EmpresaRepository extends IEmpresaRepository {
  async findById(id) {
    return await prisma.empresas.findUnique({ where: { id_empresa: id } });
  }

  async findByCodigo(codigo) {
    return await prisma.empresas.findUnique({ where: { codigo_unico_url: codigo } });
  }
}

module.exports = EmpresaRepository;