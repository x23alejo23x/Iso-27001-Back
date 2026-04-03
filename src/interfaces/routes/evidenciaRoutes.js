const express = require('express');
const router = express.Router();
const EvidenciaController = require('../controllers/EvidenciaController');
const EvidenciaService = require('../../application/evidencia/EvidenciaService');
const EvidenciaRepository = require('../../infrastructure/repositories/EvidenciaRepository');
const SeguimientoRepository = require('../../infrastructure/repositories/SeguimientoRepository');

const evidenciaController = new EvidenciaController(
  new EvidenciaService(new EvidenciaRepository(), new SeguimientoRepository())
);

/**
 * @swagger
 * /evidencias:
 *   post:
 *     summary: Subir una evidencia
 *     tags: [Evidencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seguimiento_id: { type: string }
 *               nombre_del_archivo: { type: string }
 *               link_al_archivo: { type: string }
 *     responses:
 *       201: { description: Evidencia creada }
 *       400: { description: Datos inválidos }
 */
router.post('/', (req, res) => evidenciaController.create(req, res));

/**
 * @swagger
 * /evidencias/{seguimientoId}:
 *   get:
 *     summary: Obtener evidencias de un seguimiento
 *     tags: [Evidencias]
 *     parameters:
 *       - in: path
 *         name: seguimientoId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de evidencias }
 */
router.get('/:seguimientoId', (req, res) => evidenciaController.getBySeguimiento(req, res));

/**
 * @swagger
 * /evidencias/{id}:
 *   delete:
 *     summary: Eliminar una evidencia
 *     tags: [Evidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Evidencia eliminada }
 *       404: { description: No encontrada }
 */
router.delete('/:id', (req, res) => evidenciaController.delete(req, res));

module.exports = router;