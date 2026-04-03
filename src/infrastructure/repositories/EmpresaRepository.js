const IEmpresaRepository = require('../../domain/repositories/IEmpresaRepository');
const prisma = require('../database/prisma');
class EmpresaRepository extends IEmpresaRepository {
  async findByCodigoUnico(codigo) {
    return await prisma.empresas.findUnique({ where: { codigo_unico_url: codigo } });
  }
}
module.exports = EmpresaRepository;