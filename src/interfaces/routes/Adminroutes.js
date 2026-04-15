const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const AdminService = require("../../application/admin/AdminService");
const UsuarioRepository = require("../../infrastructure/repositories/UsuarioRepository");
const EmpresaRepository = require("../../infrastructure/repositories/EmpresaRepository");

const adminController = new AdminController(
  new AdminService(new UsuarioRepository(), new EmpresaRepository()),
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
router.get("/empresa", (req, res) => adminController.getEmpresa(req, res));

/**
 * @swagger
 * /admin/Lista-usuarios:
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
router.get("/Lista-usuarios", (req, res) =>
  adminController.listarUsuarios(req, res),
);

/**
 * @swagger
 * /admin/Crear-usuarios:
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
 *               password: { type: string }
 *               empresa_id: { type: string }
 *               rol_id: { type: integer }
 *               departamento_id: { type: string, description: "ID del departamento (UUID)" }
 *     responses:
 *       201: { description: Usuario creado }
 *       400: { description: Datos inválidos }
 */
router.post("/Crear-usuarios", (req, res) =>
  adminController.crearUsuario(req, res),
);

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
 *               empresa_id: { type: string }
 *               departamento_id: { type: string, description: "ID del departamento (UUID)" }
 *     responses:
 *       200: { description: Usuario actualizado }
 *       404: { description: Usuario no encontrado }
 */
router.put("/usuarios/:id", (req, res) =>
  adminController.editarUsuario(req, res),
);

/**
 * @swagger
 * /admin/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID del usuario
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200: { description: Usuario eliminado }
 *       404: { description: Usuario no encontrado }
 */
router.delete("/usuarios/:id", (req, res) =>
  adminController.eliminarUsuario(req, res),
);

/**
 * @swagger
 * /admin/departamentos:
 *   get:
 *     summary: Listar todos los departamentos de una empresa
 *     tags: [Departamentos]
 *     parameters:
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200:
 *         description: Lista de departamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_departamento: { type: string }
 *                   nombre_departamento: { type: string }
 *                   descripcion: { type: string }
 *                   _count:
 *                     type: object
 *                     properties:
 *                       usuarios: { type: integer }
 *       400: { description: Falta empresa_id }
 */
router.get("/departamentos", (req, res) =>
  adminController.listarDepartamentos(req, res),
);

/**
 * @swagger
 * /admin/departamentos:
 *   post:
 *     summary: Crear un nuevo departamento
 *     tags: [Departamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empresa_id
 *               - nombre_departamento
 *             properties:
 *               empresa_id:
 *                 type: string
 *                 description: ID de la empresa (UUID)
 *               nombre_departamento:
 *                 type: string
 *                 description: Nombre del departamento
 *               descripcion:
 *                 type: string
 *                 description: Descripción opcional del departamento
 *     responses:
 *       201:
 *         description: Departamento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_departamento: { type: string }
 *                 empresa_id: { type: string }
 *                 nombre_departamento: { type: string }
 *                 descripcion: { type: string }
 *       400: { description: Datos inválidos o departamento ya existe }
 */
router.post("/departamentos", (req, res) =>
  adminController.crearDepartamento(req, res),
);

/**
 * @swagger
 * /admin/departamentos/{id}:
 *   delete:
 *     summary: Eliminar un departamento
 *     tags: [Departamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID del departamento (UUID)
 *       - in: query
 *         name: empresa_id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la empresa (UUID)
 *     responses:
 *       200:
 *         description: Departamento eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *       400:
 *         description: No se puede eliminar un departamento con usuarios asignados
 *       404: { description: Departamento no encontrado }
 */
router.delete("/departamentos/:id", (req, res) =>
  adminController.eliminarDepartamento(req, res),
);

module.exports = router;
