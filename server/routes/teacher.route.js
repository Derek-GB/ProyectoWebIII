import express from 'express';
import * as teacherController from '../controllers/teacher.controller.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Profesores
 *   description: Gestión de profesores
 */
const router = express.Router();

/**
 * @swagger
 * /teacher:
 *   get:
 *     summary: Obtener todos los profesores
 *     tags: [Profesores]
 *     responses:
 *       200:
 *         description: Lista de profesores
 *       500:
 *         description: Error en la base de datos
 */
router.get('/', allowRoles('admin','coordinador','consultor'), teacherController.getAll);

/**
 * @swagger
 * /teacher/{id}:
 *   get:
 *     summary: Obtener un profesor por ID
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del profesor
 *     responses:
 *       200:
 *         description: Profesor obtenido correctamente
 *       400:
 *         description: ID del profesor es requerido
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error en la base de datos
 */
router.get('/:id', allowRoles('admin','coordinador','consultor'), teacherController.getById);

/**
 * @swagger
 * /teacher:
 *   post:
 *     summary: Crear un nuevo profesor
 *     tags: [Profesores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               especialidad:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profesor creado exitosamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error al agregar profesor
 */
router.post('/', allowRoles('admin'), teacherController.create);

/**
 * @swagger
 * /teacher/{id}:
 *   put:
 *     summary: Actualizar un profesor existente
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del profesor
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               especialidad:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profesor actualizado exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error al actualizar profesor
 */
router.put('/:id', allowRoles('admin','coordinador'), teacherController.update);

/**
 * @swagger
 * /teacher/{id}:
 *   delete:
 *     summary: Eliminar un profesor
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del profesor
 *     responses:
 *       200:
 *         description: Profesor eliminado exitosamente
 *       400:
 *         description: ID del profesor es requerido
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error al eliminar profesor
 */
router.delete('/:id', allowRoles('admin'), teacherController.deleteById);

/**
 * @swagger
 * /teacher/{nombre}/schedule:
 *   get:
 *     summary: Obtener el horario de un profesor por nombre
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del profesor
 *     responses:
 *       200:
 *         description: Horario obtenido correctamente
 *       400:
 *         description: Nombre del profesor es requerido
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error en la base de datos
 */
router.get('/:nombre/schedule', allowRoles('admin','coordinador','consultor'), teacherController.getScheduleByTeacher);

export default router;