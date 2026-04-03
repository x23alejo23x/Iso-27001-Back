const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const DashboardService = require('../../application/dashboard/DashboardService');
const SeguimientoRepository = require('../../infrastructure/repositories/SeguimientoRepository');
const ControlRepository = require('../../infrastructure/repositories/ControlRepository');

const dashboardController = new DashboardController(
  new DashboardService(new SeguimientoRepository(), new ControlRepository())
);

/**
 * @swagger
 * /dashboard/metricas:
 *   get:
 *     summary: Obtener métricas generales de cumplimiento
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200: { description: Métricas calculadas }
 *       400: { description: Falta empresa_id }
 */
router.get('/metricas', (req, res) => dashboardController.getMetricas(req, res));

/**
 * @swagger
 * /dashboard/gap-analysis:
 *   get:
 *     summary: Análisis de brechas (controles no cumplidos)
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200: { description: Lista de controles con brechas }
 *       400: { description: Falta empresa_id }
 */
router.get('/gap-analysis', (req, res) => dashboardController.getGapAnalysis(req, res));

/**
 * @swagger
 * /dashboard/por-dominio:
 *   get:
 *     summary: Cumplimiento agregado por dominio
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200: { description: Datos por dominio }
 *       400: { description: Falta empresa_id }
 */
router.get('/por-dominio', (req, res) => dashboardController.getPorDominio(req, res));

module.exports = router;