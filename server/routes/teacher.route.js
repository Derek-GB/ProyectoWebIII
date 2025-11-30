import express from 'express';
import * as teacherService from '../services/teacher.service.js'

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const teachers = await teacherService.getAll();
        res.json(teachers);
    } catch (err) {
        console.error('Error en consulta:', err);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const teacher = await teacherService.getById(req.params.id);
        res.status(200).json(teacher);
    } catch (err) {
        console.error('Error en consulta:', err);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

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