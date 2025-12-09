import express from 'express';
import * as scheduleController from '../controllers/schedule.controller.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Horarios
 *   description: Gestión de horarios
 */

const router = express.Router();

/**
 * @swagger
 * /schedule:
 *   get:
 *     summary: Obtener todos los horarios
 *     tags: [Horarios]
 *     responses:
 *       200:
 *         description: Lista de horarios obtenida correctamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', allowRoles('admin','coordinador','consultor'), scheduleController.getAll);

/**
 * @swagger
 * /schedule/{id}:
 *   get:
 *     summary: Obtener un horario por ID
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario a obtener
 *     responses:
 *       200:
 *         description: Horario encontrado
 *       400:
 *         description: ID faltante o inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', allowRoles('admin','coordinador','consultor'), scheduleController.getById);

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Crear un nuevo horario
 *     tags: [Horarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aula_id
 *               - profesor_id
 *               - dia_semana
 *               - hora_inicio
 *               - hora_fin
 *               - curso
 *             properties:
 *               aula_id:
 *                 type: integer
 *               profesor_id:
 *                 type: integer
 *               dia_semana:
 *                 type: string
 *                 enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado]
 *               hora_inicio:
 *                 type: string
 *                 example: "08:00"
 *               hora_fin:
 *                 type: string
 *                 example: "10:00"
 *               curso:
 *                 type: string
 *                 maxLength: 120
 *     responses:
 *       201:
 *         description: Horario creado exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       500:
 *         description: Error en el servidor
 */
router.post('/', allowRoles('admin','coordinador'), scheduleController.create);

/**
 * @swagger
 * /schedule/{id}:
 *   put:
 *     summary: Actualizar un horario existente
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aula_id:
 *                 type: integer
 *               profesor_id:
 *                 type: integer
 *               dia_semana:
 *                 type: string
 *                 enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado]
 *               hora_inicio:
 *                 type: string
 *                 example: "08:00"
 *               hora_fin:
 *                 type: string
 *                 example: "10:00"
 *     responses:
 *       200:
 *         description: Horario actualizado correctamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', allowRoles('admin','coordinador'), scheduleController.update);

/**
 * @swagger
 * /schedule/{id}:
 *   delete:
 *     summary: Eliminar un horario
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario a eliminar
 *     responses:
 *       200:
 *         description: Horario eliminado correctamente
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', allowRoles('admin','coordinador'), scheduleController.deleteById);

/**
 * @swagger
 * /schedule/teacher/{teacher}/day/{day}/hour/{hour}:
 *   get:
 *     summary: Obtener numero de aula por profesor, día y hora específica
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: teacher
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del profesor (coincidencia parcial)
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado]
 *         description: Día de la semana
 *       - in: path
 *         name: hour
 *         required: true
 *         schema:
 *           type: string
 *           example: "13:30"
 *         description: Hora exacta a consultar (formato HH:MM)
 *     responses:
 *       200:
 *         description: Horario encontrado
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error del servidor
 */
router.get('/teacher/:teacher/day/:day/hour/:hour', allowRoles('admin','coordinador','consultor'), scheduleController.getScheduleByTeacherAndDay);

/**
 * @swagger
 * /schedule/course/{course}/day/{day}/hour/{hour}:
 *   get:
 *     summary: Obtener numero de aula por curso, día y hora específica
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: course
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del curso (coincidencia parcial)
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado]
 *         description: Día de la semana
 *       - in: path
 *         name: hour
 *         required: true
 *         schema:
 *           type: string
 *           example: "13:30"
 *         description: Hora exacta a consultar (formato HH:MM o HH:MM:SS)
 *     responses:
 *       200:
 *         description: Horario encontrado
 *       404:
 *         description: No se encontraron coincidencias
 *       500:
 *         description: Error del servidor
 */
router.get('/course/:course/day/:day/hour/:hour', allowRoles('admin','coordinador','consultor'), scheduleController.getScheduleByCourseAndDay);

/**
 * @swagger
 * /schedule/teacher/{teacher}/classroomNumber/{numberClass}/classroomType/{typeClass}:
 *   get:
 *     summary: Obtener horario por profesor y aula específica (número y tipo)
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: teacher
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del profesor (coincidencia parcial)
 *
 *       - in: path
 *         name: numberClass
 *         required: true
 *         schema:
 *           type: string
 *         description: Número o nombre del aula (coincidencia parcial)
 *
 *       - in: path
 *         name: typeClass
 *         required: true
 *         schema:
 *           type: string
 *           enum: [laboratorio, aula]
 *         description: Tipo del aula
 *
 *     responses:
 *       200:
 *         description: Horarios encontrados
 *       404:
 *         description: No se encontraron coincidencias
 *       500:
 *         description: Error del servidor
 */
router.get('/teacher/:teacher/classroomNumber/:numberClass/classroomType/:typeClass', allowRoles('admin','coordinador','consultor'), scheduleController.getClassByCourseAndDay);

/**
 * @swagger
 * /schedule/classroomNumber/{numberClass}/classroomType/{typeClass}/day/{day}/hour/{hour}:
 *   get:
 *     summary: Obtener el profesor asignado a un aula en una fecha y hora específicas
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: numberClass
 *         required: true
 *         schema:
 *           type: string
 *         description: Número o nombre del aula
 *
 *       - in: path
 *         name: typeClass
 *         required: true
 *         schema:
 *           type: string
 *           enum: [laboratorio, aula]
 *         description: Tipo del aula
 *
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado]
 *         description: Día de la semana
 *
 *       - in: path
 *         name: hour
 *         required: true
 *         schema:
 *           type: string
 *           example: "09:30"
 *         description: Hora exacta a consultar (formato HH:MM o HH:MM:SS)
 *
 *     responses:
 *       200:
 *         description: Profesor encontrado en esa aula y hora
 *       404:
 *         description: No se encontró un profesor asignado
 *       500:
 *         description: Error del servidor
 */
router.get('/classroomNumber/:numberClass/classroomType/:typeClass/day/:day/hour/:hour', allowRoles('admin','coordinador','consultor'), scheduleController.getTeacherByClassAndDay);

/**
 * @swagger
 * /schedule/{verification}:
 *   delete:
 *     summary: Eliminar todos los horarios según el parámetro de verificación
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: verification
 *         required: true
 *         schema:
 *           type: string
 *         description: Parámetro de verificación para autorizar la eliminación masiva
 *     responses:
 *       200:
 *         description: Horarios eliminados correctamente
 *       400:
 *         description: La verificación no permite eliminar los horarios
 *       404:
 *         description: No se eliminaron registros
 *       500:
 *         description: Error del servidor
 */
router.delete('/:verification', allowRoles('admin'), scheduleController.deleteAll);

export default router; 