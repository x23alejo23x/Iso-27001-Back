// src/interfaces/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const AuthService = require("../../application/auth/AuthService");
const UsuarioRepository = require("../../infrastructure/repositories/UsuarioRepository");
const EmpresaRepository = require("../../infrastructure/repositories/EmpresaRepository");

// 🔥 CORREGIDO: Pasar ambos repositorios (usuario y empresa)
const authController = new AuthController(
  new AuthService(new UsuarioRepository(), new EmpresaRepository()),
);

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
router.post("/login", (req, res) => authController.login(req, res));

/**
 * @swagger
 * /auth/registrar-empresa:
 *   post:
 *     summary: Registrar una nueva empresa con 2 administradores
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre_comercial, codigo_unico_url, administradores]
 *             properties:
 *               nombre_comercial: { type: string }
 *               codigo_unico_url: { type: string }
 *               administradores:
 *                 type: array
 *                 minItems: 2
 *                 maxItems: 2
 *                 items:
 *                   type: object
 *                   required: [nombre_usuario, correo_electronico, password]
 *                   properties:
 *                     nombre_usuario: { type: string }
 *                     correo_electronico: { type: string }
 *                     password: { type: string }
 *     responses:
 *       201: { description: Empresa y administradores creados }
 *       400: { description: Datos inválidos }
 */
router.post("/registrar-empresa", (req, res) =>
  authController.registrarEmpresa(req, res),
);

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
router.put("/cambiar-password", (req, res) =>
  authController.cambiarPassword(req, res),
);

module.exports = router;
