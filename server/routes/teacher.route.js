import express from 'express';
import * as teacherService from '../services/teacher.service.js'


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
router.get('/', async (req, res) => {
    try {
        const teachers = await teacherService.getAll();
        res.json(teachers);
    } catch (err) {
        console.error('Error en consulta:', err);
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
 *       500:
 *         description: Error en la base de datos
 */


router.get('/:id', async (req, res) => {
    try {
        const teacher = await teacherService.getById(req.params.id);
        res.status(200).json(teacher);
    } catch (err) {
        console.error('Error en consulta:', err);
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
 *         description: El profesor no puede estar vacío
 *       500:
 *         description: Error al agregar profesor
 */

router.post('/', async (req, res) => {
    try {
        const newTeacher = await teacherService.create(req.body);
        res.status(201).json(newTeacher);
    } catch (err) {
        if (err.message === 'El profesor no puede estar vacío') {
            res.status(400).json({ error: err.message });
        }else {
            console.error('Error al insertar:', err);
            res.status(500).json({ error: 'Error al agregar profesor' });
        }
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
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTeacher = await teacherService.update(id, req.body);
        res.json(updatedTeacher);
    } catch (err) {
        if (err.message === 'Profesor no encontrado') {
            res.status(404).json({ error: err.message });
        } else if (err.message.includes('proporcionar')) {  
            res.status(400).json({ error: err.message });
        } else {
            console.error('Error al actualizar:', err);
            res.status(500).json({ error: 'Error al actualizar profesor' });
        }  
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
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error al eliminar profesor
 */

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const result = await teacherService.deleteById(id);
        res.json(result);
    } catch (err) {
        if (err.message === 'Profesor no encontrado') {
            res.status(404).json({ error: err.message });
        } else {
            console.error('Error al eliminar:', err);
            res.status(500).json({ error: 'Error al eliminar profesor' });
        }
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
 *       500:
 *         description: Error en la base de datos
 */
router.get('/:nombre/schedule', async (req, res) => {
    try {
        const { nombre } = req.params;
        const schedule = await teacherService.getScheduleByTeacher(nombre);
        res.status(200).json(schedule);
    } catch (err) {
        console.error('Error en consulta:', err);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

export default router;