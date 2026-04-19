const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/DashboardController");
const DashboardService = require("../../application/dashboard/DashboardService");
const SeguimientoRepository = require("../../infrastructure/repositories/SeguimientoRepository");
const ControlRepository = require("../../infrastructure/repositories/ControlRepository");

const dashboardController = new DashboardController(
  new DashboardService(new SeguimientoRepository(), new ControlRepository()),
);

/**
 * @swagger
 * /dashboard/cumplidos:
 *   get:
 *     summary: Obtener controles cumplidos (estado_id = 1) por empresa
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200:
 *         description: Lista de controles cumplidos
 *         content:
 *           application/json:
 *             example:
 *               - id_seguimiento: "uuid"
 *                 control_id: "uuid"
 *                 fecha: "2026-04-19T16:52:20.511Z"
 *                 responsable: "Juan Perez"
 *                 justificacion: "Cumple correctamente"
 *       400:
 *         description: Falta empresa_id
 */
router.get("/cumplidos", (req, res) =>
  dashboardController.getCumplidos(req, res),
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
router.get("/metricas", (req, res) =>
  dashboardController.getMetricas(req, res),
);

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
router.get("/gap-analysis", (req, res) =>
  dashboardController.getGapAnalysis(req, res),
);

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
router.get("/por-dominio", (req, res) =>
  dashboardController.getPorDominio(req, res),
);

module.exports = router;
