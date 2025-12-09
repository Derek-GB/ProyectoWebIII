import express from 'express';
import classroomController from '../controllers/classroom.controller.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Aulas
 *   description: Gestión de aulas
 */
const router = express.Router();

/**
 * @swagger
 * /classroom:
 *   get:
 *     summary: Obtener todas las aulas
 *     tags: [Aulas]
 *     responses:
 *       200:
 *         description: Lista de aulas
 *       404:
 *         description: No hay aulas disponibles
 *       500:
 *         description: Error del servidor
 */
router.get('/', allowRoles('admin', 'coordinador', 'consultor'), classroomController.getAllClassrooms);

/**
 * @swagger
 * /classroom/get/{id}:
 *   get:
 *     summary: Obtener aula por ID
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aula
 *     responses:
 *       200:
 *         description: Aula encontrada
 *       400:
 *         description: ID faltante o inválido
 *       404:
 *         description: Aula no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/get/:id', allowRoles('admin', 'coordinador', 'consultor'), classroomController.getClassroomById);

/**
 * @swagger
 * /classroom/availables:
 *   get:
 *     summary: Obtener aulas disponibles
 *     tags: [Aulas]
 *     parameters:
 *       - in: query
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado]
 *         description: Día de la semana
 *       - in: query
 *         name: hour
 *         required: true
 *         schema:
 *           type: string
 *           example: "14:30"
 *         description: Hora en formato HH:MM (24h)
 *     responses:
 *       200:
 *         description: Lista de aulas disponibles
 *       400:
 *         description: Parámetros inválidos
 *       404:
 *         description: No hay aulas disponibles
 *       500:
 *         description: Error del servidor
 */
router.get('/availables', allowRoles('admin', 'coordinador', 'consultor'), classroomController.getClassroomAvailables);

/**
 * @swagger
 * /classroom:
 *   post:
 *     summary: Crear un aula nueva
 *     tags: [Aulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - building
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               building:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [laboratorio, aula]
 *     responses:
 *       201:
 *         description: Aula creada exitosamente
 *       400:
 *         description: Datos faltantes o tipo inválido
 *       500:
 *         description: Error al insertar
 */
router.post('/', allowRoles('admin'), classroomController.postClassroom);

/**
 * @swagger
 * /classroom/{id}:
 *   put:
 *     summary: Editar un aula existente
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               building:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [laboratorio, aula]
 *     responses:
 *       200:
 *         description: Aula actualizada
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error de servidor
 */
router.put('/:id', allowRoles('admin'), classroomController.putClassroom);

/**
 * @swagger
 * /classroom/{id}:
 *   delete:
 *     summary: Eliminar un aula
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aula
 *     responses:
 *       200:
 *         description: Aula eliminada correctamente
 *       400:
 *         description: ID faltante
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', allowRoles('admin'), classroomController.deleteClassroomById);

export default router;