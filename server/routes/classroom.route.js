import express from 'express';
import * as classroomService from '../services/classroom.service.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Aulas
 *   description: Gestión de aulas
 */
const router = express.Router();
const types = ['laboratorio', 'aula'];

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
router.get('/', allowRoles('admin', 'coordinador', 'consultor'), async (req, res) => {
    try {
        const classrooms = await classroomService.getAll();
        res.status(200).json(classrooms);
    } catch (err) {
        console.error('Error en consulta:', err);
        const code = err.message === 'No hay aulas disponibles' ? 404 : 500;
        res.status(code).json({ error: 'Error al obtener las aulas: ' + err.message });
    }
});

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
router.get('/get/:id', allowRoles('admin', 'coordinador', 'consultor'), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del aula es requerido' });
    }
    try {
        const classroom = await classroomService.getById(req.params.id);
        res.status(200).json(classroom);
    } catch (err) {
        console.error('Error en consulta:', err);
        const code = err.message === 'Aula no encontrada' ? 404 : 500;
        res.status(code).json({ error: 'Error al obtener el aula: ' + err.message });
    }
});

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
router.get('/availables', allowRoles('admin', 'coordinador', 'consultor'), async (req, res) => {
    if (!req.query) return res.status(400).json({ error: 'Parámetros de consulta son requeridos' });
    const { day, hour } = req.query;
    if (!day || !hour) return res.status(400).json({ error: 'Día y hora son requeridos' });
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    if (!days.includes(day)) {
        return res.status(400).json({ error: 'Día inválido. Los días permitidos son: ' + days.join(', ') });
    }
    const hourFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!hourFormat.test(hour)) {
        return res.status(400).json({ error: 'Hora inválida. El formato correcto es HH:MM en formato 24 horas.' });
    }
    try {
        const availableClassrooms = await classroomService.getAvailable(day, hour);
        res.status(200).json(availableClassrooms);
    } catch (err) {
        console.error('Error en consulta:', err);
        const code = err.message === 'No hay aulas disponibles' ? 404 : 500;
        res.status(code).json({ error: 'Error al obtener las aulas disponibles: ' + err.message });
    }
});

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
router.post('/', allowRoles('admin'), async (req, res) => {
    if (!req.body || !req.body.name || !req.body.building || !req.body.type) {
        return res.status(400).json({ error: 'Datos incompletos para crear el aula' });
    }
    if (!types.includes(req.body.type)){
        return res.status(400).json({ error: 'Tipo de aula inválido. Los tipos permitidos son: ' + types.join(', ') });
    }
    try {
        const newClassroom = await classroomService.create({name: req.body.name, building: req.body.building, type: req.body.type});
        res.status(201).json(newClassroom);
    } catch (err) {
        console.error('Error al insertar:', err);
        const msg = err.message.toLowerCase();
        let code = 500;
        if (msg.includes('id') || msg.includes('cantidad') || msg.includes('cadena'))
            code = 400;
        res.status(code).json({ error: 'Error al agregar inventario: ' + err.message });
    }
});

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
router.put('/:id', allowRoles('admin'), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del inventario es requerido' });
    }
    if (!req.body) {
        return res.status(400).json({ error: 'No se enviaron datos para actualizar el aula' });
    }
    const { name, building, type } = req.body;
    if (type && !types.includes(type)){
        return res.status(400).json({ error: 'Tipo de aula inválido. Los tipos permitidos son: ' + types.join(', ') });
    }
    if (name || building || type) {
        try {
            const updatedClassroom = await classroomService.update(req.params.id, { name, building, type });
            res.status(200).json(updatedClassroom);
        } catch (err) {
            console.error('Error al actualizar:', err);
            const msg = err.message.toLowerCase();
            let code = 500;
            if (msg.includes('id') || msg.includes('cantidad') || msg.includes('cadena'))
            code = 400;
            res.status(code).json({ error: 'Error al agregar inventario: ' + err.message });
        }
    } else {
        return res.status(400).json({ error: 'No se enviaron datos válidos para actualizar el aula' });
    }
});

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
router.delete('/:id', allowRoles('admin'), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del aula es requerido' });
    }
    try {
        const result = await classroomService.deleteById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error al eliminar:', err);
        const code = err.message === 'Aula no encontrada' ? 404 : 500;
        res.status(code).json({ error: 'Error al eliminar el aula: ' + err.message });
    }
});

export default router;