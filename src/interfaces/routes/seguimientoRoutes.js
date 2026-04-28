const express = require("express");
const router = express.Router();
const SeguimientoController = require("../controllers/SeguimientoController");
const SeguimientoService = require("../../application/seguimiento/SeguimientoService");
const SeguimientoRepository = require("../../infrastructure/repositories/SeguimientoRepository");
const ControlRepository = require("../../infrastructure/repositories/ControlRepository");
const seguimientoService = new SeguimientoService(
  new SeguimientoRepository(),
  new ControlRepository(),
);

const seguimientoController = new SeguimientoController(seguimientoService);

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
 *         schema:
 *           type: string
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200:
 *         description: Lista de seguimientos
 *       400:
 *         description: Falta empresa_id
 */
router.get("/", (req, res) => seguimientoController.getByEmpresa(req, res));

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
 *         schema:
 *           type: string
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200:
 *         description: Resumen estadístico
 *       400:
 *         description: Falta empresa_id
 */
router.get("/resumen", (req, res) =>
  seguimientoController.getResumen(req, res),
);

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
 *         schema:
 *           type: string
 *         description: ID del control
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Historial de seguimientos
 *       400:
 *         description: Falta empresa_id
 */
router.get("/historial/:controlId", (req, res) =>
  seguimientoController.getHistorial(req, res),
);

/**
 * @swagger
 * /seguimiento/control/{controlId}:
 *   put:
 *     summary: Crear o actualizar el seguimiento de un control (upsert)
 *     tags: [Seguimiento]
 *     parameters:
 *       - in: path
 *         name: controlId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del control
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empresa_id
 *               - quien_actualizo_id
 *               - estado_id
 *             properties:
 *               empresa_id:
 *                 type: string
 *               quien_actualizo_id:
 *                 type: string
 *               estado_id:
 *                 type: integer
 *               nombre_del_responsable:
 *                 type: string
 *               descripcion_justificacion:
 *                 type: string
 *               url_evidencia:
 *                 type: string
 *                 description: URL opcional de la evidencia
 *     responses:
 *       200:
 *         description: Seguimiento creado o actualizado
 */
router.put("/control/:controlId", (req, res) =>
  seguimientoController.upsert(req, res),
);

module.exports = router;
