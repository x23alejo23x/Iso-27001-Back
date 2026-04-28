const express = require("express");
const multer = require("multer");
const AnalisisIAController = require("../controllers/AnalisisIAController");
const AnalisisIAService = require("../../application/ia/AnalisisIAService");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const service = new AnalisisIAService();
const controller = new AnalisisIAController(service);

/**
 * @swagger
 * /ia/analizar:
 *   post:
 *     summary: Analizar un PDF contra un control ISO 27001 específico
 *     tags:
 *       - Análisis IA
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - empresa_id
 *               - control_id
 *               - archivo
 *             properties:
 *               empresa_id:
 *                 type: string
 *                 format: uuid
 *                 example: "00000000-0000-0000-0000-000000000001"
 *               control_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del control específico a evaluar
 *                 example: "c8acb8de-0481-4e14-811c-76dad140c289"
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: PDF a analizar (máximo 10MB)
 *     responses:
 *       200:
 *         description: Análisis completado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 control:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     codigo:
 *                       type: string
 *                       example: "A.8.1.1"
 *                     nombre:
 *                       type: string
 *                       example: "Inventario de activos"
 *                 estado_sugerido_ia:
 *                   type: string
 *                   enum: [Cumple, "No Cumple", Parcial]
 *                 justificacion_ia:
 *                   type: string
 *       400:
 *         description: Faltan campos requeridos
 *       500:
 *         description: Error del servidor
 */
router.post("/analizar", upload.single("archivo"), (req, res) =>
  controller.analizarDocumento(req, res),
);

module.exports = router;
