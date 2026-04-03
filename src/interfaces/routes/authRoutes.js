const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthService = require('../../application/auth/AuthService');
const UsuarioRepository = require('../../infrastructure/repositories/UsuarioRepository');
const router = express.Router();

const usuarioRepository = new UsuarioRepository();
const authService = new AuthService(usuarioRepository);
const authController = new AuthController(authService);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: demo@test.com }
 *               password: { type: 123456 }
 *     responses:
 *       200: { description: Login exitoso }
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', (req, res) => authController.login(req, res));

module.exports = router;

