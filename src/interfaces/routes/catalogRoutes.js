const express = require("express");
const CatalogController = require("../controllers/CatalogController");
const CatalogService = require("../../application/common/CatalogService");
const RolRepository = require("../../infrastructure/repositories/RolRepository");
const EstadoRepository = require("../../infrastructure/repositories/EstadoRepository");

const router = express.Router();
const rolRepository = new RolRepository();
const estadoRepository = new EstadoRepository();
const catalogService = new CatalogService(rolRepository, estadoRepository);
const catalogController = new CatalogController(catalogService);

/**
 * @swagger
 * /catalog/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Catálogos]
 *     responses:
 *       200: { description: Lista de roles }
 *       500: { description: Error interno }
 */
router.get("/roles", (req, res) => catalogController.getRoles(req, res));

/**
 * @swagger
 * /catalog/estados:
 *   get:
 *     summary: Obtener todos los estados de control
 *     tags: [Catálogos]
 *     responses:
 *       200: { description: Lista de estados }
 *       500: { description: Error interno }
 */
router.get("/estados", (req, res) => catalogController.getEstados(req, res));

module.exports = router;