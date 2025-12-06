import express from 'express';
import * as usersService from '../services/user.service.js';
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
router.get('/', allowRoles('admin'), async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.json(users);
  } catch (err) {
    console.error('Error en consulta:', err.message || err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

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
router.get('/:id', allowRoles('admin'), async (req, res) => {
  try {
    const user = await usersService.getById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.status(200).json(user);

  } catch (err) {
    console.error('Error en consulta:', err.message);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

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
router.post('/',allowRoles('admin'), async (req, res) => {
  try {
    const newUser = await usersService.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    if (err.message === 'El usuario no puede estar vacío') {
      return res.status(400).json({ error: err.message });
    }

    console.error('Error al insertar:', err);
    res.status(500).json({ error: 'Error al agregar usuario' });
  }
});

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
router.put('/:id', allowRoles('admin'),async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await usersService.update(id, req.body);
    res.json(updatedUser);
  } catch (err) {
    console.error('Error al actualizar usuario:', err.message);

    if (err.message === 'El usuario no existe') {
      return res.status(404).json({
        error: 'El usuario no existe'
      });
    }

    if (err.message.includes('vacío') || err.message.includes('proporcionar')) {
      return res.status(400).json({
        error: err.message
      });
    }

    return res.status(500).json({
      error: 'Error al actualizar usuario'
    });
  }
});

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
router.put('/:id/password',allowRoles('consultor','coordinador','admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const result = await usersService.changePassword(id, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al actualizar contraseña:', err.message);

    if (err.message === 'El usuario no existe') {
      return res.status(404).json({ error: err.message });
    }

    if (err.message === 'La contraseña actual es incorrecta') {
      return res.status(401).json({ error: err.message });
    }

    if (err.message.includes('Debes proporcionar')) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
});

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
router.delete('/:id',allowRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersService.deleteById(id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User not found' || err.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.error('Error al eliminar:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});


export default router; 
