const express = require('express');
const router = express.Router();
const ControlController = require('../controllers/ControlController');
const ControlService = require('../../application/control/ControlService');
const ControlRepository = require('../../infrastructure/repositories/ControlRepository');
const SeguimientoRepository = require('../../infrastructure/repositories/SeguimientoRepository');

const controlController = new ControlController(
  new ControlService(new ControlRepository(), new SeguimientoRepository())
);

/**
 * @swagger
 * /controles:
 *   get:
 *     summary: Listar todos los controles
 *     tags: [Controles]
 *     responses:
 *       200: { description: Lista de controles }
 */
router.get('/', (req, res) => controlController.getAll(req, res));

/**
 * @swagger
 * /controles/buscar:
 *   get:
 *     summary: Buscar controles por palabra clave
 *     tags: [Controles]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Término de búsqueda
 *     responses:
 *       200: { description: Resultados de búsqueda }
 */
router.get('/buscar', (req, res) => controlController.buscar(req, res));

/**
 * @swagger
 * /controles/{id}:
 *   get:
 *     summary: Obtener detalle de un control (con seguimiento para una empresa)
 *     tags: [Controles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID del control
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200: { description: Detalle del control y su seguimiento para la empresa }
 *       400: { description: Falta empresa_id }
 *       404: { description: Control no encontrado }
 */
router.get('/:id', (req, res) => controlController.getDetalle(req, res));

module.exports = router;