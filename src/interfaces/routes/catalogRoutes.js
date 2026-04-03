const express = require('express');
const router = express.Router();
const prisma = require('../../infrastructure/database/prisma');

/**
 * @swagger
 * /catalog/estados:
 *   get:
 *     summary: Obtener todos los estados de control
 *     tags: [Catálogos]
 *     responses:
 *       200: { description: Lista de estados }
 */
router.get('/estados', async (req, res) => {
  try {
    const estados = await prisma.estados_de_control.findMany({ orderBy: { id_estado: 'asc' } });
    res.json(estados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /catalog/roles:
 *   get:
 *     summary: Obtener todos los roles de usuario
 *     tags: [Catálogos]
 *     responses:
 *       200: { description: Lista de roles }
 */
router.get('/roles', async (req, res) => {
  try {
    const roles = await prisma.roles_de_usuario.findMany({ orderBy: { id_rol: 'asc' } });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;