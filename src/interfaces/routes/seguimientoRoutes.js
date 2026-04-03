const express = require('express');
const router = express.Router();
const SeguimientoController = require('../controllers/SeguimientoController');
const SeguimientoService = require('../../application/seguimiento/SeguimientoService');
const SeguimientoRepository = require('../../infrastructure/repositories/SeguimientoRepository');
const ControlRepository = require('../../infrastructure/repositories/ControlRepository');

const seguimientoController = new SeguimientoController(
  new SeguimientoService(new SeguimientoRepository(), new ControlRepository())
);

/**
 * @swagger
 * /seguimiento:
 *   get:
 *     summary: Obtener seguimientos por empresa
 *     tags: [Seguimiento]
 *     parameters:
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200: { description: Lista de seguimientos }
 *       400: { description: Falta empresa_id }
 */
router.get('/', (req, res) => seguimientoController.getByEmpresa(req, res));

/**
 * @swagger
 * /seguimiento/resumen:
 *   get:
 *     summary: Resumen de cumplimiento por empresa
 *     tags: [Seguimiento]
 *     parameters:
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200: { description: Resumen estadístico }
 *       400: { description: Falta empresa_id }
 */
router.get('/resumen', (req, res) => seguimientoController.getResumen(req, res));

/**
 * @swagger
 * /seguimiento/historial/{controlId}:
 *   get:
 *     summary: Historial de cambios de un control
 *     tags: [Seguimiento]
 *     parameters:
 *       - in: path
 *         name: controlId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Historial de seguimientos }
 */
router.get('/historial/:controlId', (req, res) => seguimientoController.getHistorial(req, res));

/**
 * @swagger
 * /seguimiento:
 *   post:
 *     summary: Crear un nuevo seguimiento
 *     tags: [Seguimiento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empresa_id: { type: string }
 *               control_id: { type: string }
 *               estado_id: { type: integer }
 *               nombre_del_responsable: { type: string }
 *               descripcion_justificacion: { type: string }
 *     responses:
 *       201: { description: Seguimiento creado }
 *       400: { description: Datos inválidos }
 */
router.post('/', (req, res) => seguimientoController.create(req, res));

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
 *               estado_id: { type: integer }
 *               descripcion_justificacion: { type: string }
 *     responses:
 *       200: { description: Seguimiento actualizado }
 *       404: { description: No encontrado }
 */
router.put('/:id', (req, res) => seguimientoController.update(req, res));

module.exports = router;