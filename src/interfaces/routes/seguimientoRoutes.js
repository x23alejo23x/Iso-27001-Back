const express = require("express");
const SeguimientoController = require("../controllers/SeguimientoController");
const SeguimientoService = require("../../application/seguimiento/SeguimientoService");
const SeguimientoRepository = require("../../infrastructure/repositories/SeguimientoRepository");
const ControlRepository = require("../../infrastructure/repositories/ControlRepository");
const EmpresaRepository = require("../../infrastructure/repositories/EmpresaRepository");

const router = express.Router();
const seguimientoRepository = new SeguimientoRepository();
const controlRepository = new ControlRepository();
const empresaRepository = new EmpresaRepository();
const seguimientoService = new SeguimientoService(
  seguimientoRepository,
  controlRepository,
  empresaRepository,
);
const seguimientoController = new SeguimientoController(seguimientoService);

/**
 * @swagger
 * /seguimiento/{id}:
 *   put:
 *     summary: Actualizar un seguimiento
 *     tags: [Seguimiento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado: { type: string }
 *               observaciones: { type: string }
 *     responses:
 *       200: { description: Actualizado correctamente }
 *       404: { description: No encontrado }
 */
router.put("/:id", (req, res) => seguimientoController.update(req, res));

/**
 * @swagger
 * /seguimiento/empresa/{empresaId}:
 *   get:
 *     summary: Obtener seguimientos por empresa
 *     tags: [Seguimiento]
 *     parameters:
 *       - in: path
 *         name: empresaId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de seguimientos }
 *       404: { description: Empresa no encontrada }
 */
router.get("/empresa/:empresaId", (req, res) =>
  seguimientoController.getByEmpresa(req, res),
);

module.exports = router;