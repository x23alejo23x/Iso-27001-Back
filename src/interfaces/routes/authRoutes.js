// src/interfaces/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const AuthService = require('../../application/auth/AuthService');
const UsuarioRepository = require('../../infrastructure/repositories/UsuarioRepository');

const authController = new AuthController(new AuthService(new UsuarioRepository()));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión (RF-AUTH-001)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@empresa.com
 *               password:
 *                 type: string
 *                 example: "Password1"
 *     responses:
 *       200:
 *         description: Login exitoso - retorna datos del usuario
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @swagger
 * /auth/cambiar-password:
 *   put:
 *     summary: Cambiar contraseña (RF-AUTH-004)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, passwordActual, passwordNueva]
 *             properties:
 *               userId:
 *                 type: string
 *               passwordActual:
 *                 type: string
 *               passwordNueva:
 *                 type: string
 *                 description: Mínimo 8 caracteres y al menos 1 número
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Contraseña actual incorrecta o no cumple política
 */
router.put('/cambiar-password', (req, res) => authController.cambiarPassword(req, res));

module.exports = router;