import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios
 */
const router = express.Router();



/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No tiene permisos para acceder a este recurso
 *       500:
 *         description: Error en la base de datos
 */
router.get('/', allowRoles('admin'), userController.getAll);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No tiene permisos para acceder a este recurso
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en la base de datos
 */
router.get('/:id', allowRoles('admin'), userController.getById);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, coordinador, consultor]
 *                 description: Rol del usuario (opcional)
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: El usuario no puede estar vacío
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       500:
 *         description: Error al agregar usuario
 */
router.post('/', allowRoles('admin'), userController.create);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, coordinador, consultor]
 *                 description: Rol del usuario (opcional)
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos del usuario vacíos o inválidos
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: El usuario no existe
 *       500:
 *         description: Error al actualizar usuario
 */
router.put('/:id', allowRoles('admin'), userController.update);

/**
 * @swagger
 * /user/{id}/password:
 *   put:
 *     summary: Actualizar la contraseña del propio usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Contraseña actual
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Contraseña actual incorrecta o token inválido
 *       403:
 *         description: No tiene permisos para cambiar esta contraseña
 *       404:
 *         description: Usuario no existe
 *       500:
 *         description: Error al actualizar contraseña
 */
router.put('/:id/password', allowRoles('consultor','coordinador','admin'), userController.changePassword);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar usuario
 */
router.delete('/:id', allowRoles('admin'), userController.deleteById);


export default router; 
