import express from 'express';
import * as teacherService from '../services/teacher.service.js'
import { allowRoles } from '../middlewares/roleMiddleware.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/**
 * @swagger
 * tags:
 *   name: Profesores
 *   description: Gestión de profesores
 */
const router = express.Router();


/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Obtener todos los profesores
 *     tags: [Profesores]
 *     responses:
 *       200:
 *         description: Lista de profesores
 *       500:
 *         description: Error en la base de datos
 */
router.get('/', allowRoles('admin','coordinador','consultor'), async (req, res) => {
    try {
        const teachers = await teacherService.getAll();
        res.json(teachers);
    } catch (err) {
        console.error('Error en consulta:', err.message);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});


/**
 * @swagger
 * /teachers/{id}:
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


router.get('/:id', allowRoles('admin','coordinador','consultor'), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del profesor es requerido' });
    }
    try {
        const teacher = await teacherService.getById(req.params.id);
        
        if (!teacher) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }
        
        res.status(200).json(teacher);
    } catch (err) {
        console.error('Error en consulta:', err.message);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});


/**
 * @swagger
 * /teachers:
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

router.post('/', allowRoles('admin'), async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Se requiere un body para registrar un profesor' });
    }

    const { nombre, correo, especialidad } = req.body;

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: 'El campo nombre es obligatorio' });
    }

    if (correo && !emailRegex.test(correo)) {
        return res.status(400).json({ error: 'Correo inválido' });
    }

    try {
        const newTeacher = await teacherService.create({ nombre, correo, especialidad });
        res.status(201).json(newTeacher);
    } catch (err) {
        if (err.message === 'El profesor no puede estar vacío') {
            return res.status(400).json({ error: err.message });
        }
        console.error('Error al insertar:', err.message);
        res.status(500).json({ error: 'Error al agregar profesor' });
    }
});



/**
 * @swagger
 * /teachers/{id}:
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
router.put('/:id', allowRoles('admin','coordinador'), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del profesor es requerido' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Se requieren datos para actualizar' });
    }

    if (req.body.correo && !emailRegex.test(req.body.correo)) {
        return res.status(400).json({ error: 'Correo inválido' });
    }

    try {
        const { id } = req.params;
        const updatedTeacher = await teacherService.update(id, req.body);
        res.json(updatedTeacher);
    } catch (err) {
        console.error('Error al actualizar:', err.message);

        if (err.message === 'Profesor no encontrado') {
            return res.status(404).json({ error: err.message });
        }

        if (err.message.includes('proporcionar') || err.message.includes('vacío')) {
            return res.status(400).json({ error: err.message });
        }

        res.status(500).json({ error: 'Error al actualizar profesor' });
    }
});

/**
 * @swagger
 * /teachers/{id}:
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

router.delete('/:id', allowRoles('admin'), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del profesor es requerido' });
    }

    try {
        const { id } = req.params;
        const result = await teacherService.deleteById(id);
        res.json(result);
    } catch (err) {
        console.error('Error al eliminar:', err.message);

        if (err.message === 'Profesor no encontrado') {
            return res.status(404).json({ error: err.message });
        }

        res.status(500).json({ error: 'Error al eliminar profesor' });
    }
});
/**
 * @swagger
 * /teachers/{nombre}/schedule:
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
router.get('/:nombre/schedule', allowRoles('admin','coordinador','consultor'), async (req, res) => {
    if (!req.params.nombre || req.params.nombre.trim() === '') {
        return res.status(400).json({ error: 'Nombre del profesor es requerido' });
    }

    try {
        const { nombre } = req.params;
        const schedule = await teacherService.getScheduleByTeacher(nombre);
        
        if (!schedule) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }
        
        res.status(200).json(schedule);
    } catch (err) {
        console.error('Error en consulta:', err.message);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

export default router;