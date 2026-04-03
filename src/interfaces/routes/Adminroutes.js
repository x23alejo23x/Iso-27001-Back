const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const AdminService = require('../../application/admin/AdminService');
const UsuarioRepository = require('../../infrastructure/repositories/UsuarioRepository');
const EmpresaRepository = require('../../infrastructure/repositories/EmpresaRepository');

const adminController = new AdminController(
  new AdminService(new UsuarioRepository(), new EmpresaRepository())
);

/**
 * @swagger
 * /admin/empresa:
 *   get:
 *     summary: Obtener datos de una empresa
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200: { description: Datos de la empresa }
 *       400: { description: Falta empresa_id }
 *       401: { description: No autorizado }
 */
router.get('/empresa', (req, res) => adminController.getEmpresa(req, res));

/**
 * @swagger
 * /admin/usuarios:
 *   get:
 *     summary: Listar usuarios de una empresa
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200: { description: Lista de usuarios }
 *       400: { description: Falta empresa_id }
 *       401: { description: No autorizado }
 */
router.get('/usuarios', (req, res) => adminController.listarUsuarios(req, res));

/**
 * @swagger
 * /admin/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario: { type: string }
 *               correo_electronico: { type: string }
 *               contrasena_encriptada: { type: string }
 *               empresa_id: { type: string }
 *               rol_id: { type: integer }
 *     responses:
 *       201: { description: Usuario creado }
 *       400: { description: Datos inválidos }
 */
router.post('/usuarios', (req, res) => adminController.crearUsuario(req, res));

/**
 * @swagger
 * /admin/usuarios/{id}:
 *   put:
 *     summary: Editar un usuario existente
 *     tags: [Admin]
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
 *               nombre_usuario: { type: string }
 *               correo_electronico: { type: string }
 *               rol_id: { type: integer }
 *     responses:
 *       200: { description: Usuario actualizado }
 *       404: { description: Usuario no encontrado }
 */
router.put('/usuarios/:id', (req, res) => adminController.editarUsuario(req, res));

module.exports = router;