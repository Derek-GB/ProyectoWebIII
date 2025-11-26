import express from 'express';
import * as scheduleService from '../services/schedule.service.js';  

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const schedules = await scheduleService.getAll();  
    res.json(schedules);
  } catch (err) {
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const schedule = await scheduleService.getById(req.params.id);
    res.status(200).json(schedule);
  } catch (err) {
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newSchedule = await scheduleService.create(req.body);
    res.status(201).json(newSchedule);
  } catch (err) {
    if (err.message === 'El horario no puede estar vacío') {
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error al insertar:', err);
      res.status(500).json({ error: 'Error al agregar horario' });
    }
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSchedule = await scheduleService.update(id, req.body);
    res.json(updatedSchedule);
  } catch (err) {
    if (err.message === 'Horario no encontrado') {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes('proporcionar')) {  
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error al actualizar:', err);
      res.status(500).json({ error: 'Error al actualizar horario' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await scheduleService.deleteById(id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Horario no encontrado') {
      res.status(404).json({ error: err.message });
    } else {
      console.error('Error al eliminar:', err);
      res.status(500).json({ error: 'Error al eliminar horario' });
    }
  }
});

export default router; 