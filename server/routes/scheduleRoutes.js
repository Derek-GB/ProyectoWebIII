import express from 'express';
import * as scheduleService from '../services/scheduleService.js';  

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tasks = await scheduleService.getAll();  
    res.json(tasks);
  } catch (err) {
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/completed/:status', async (req, res) => {
  try {
    if (req.params.status !== 'true' && req.params.status !== 'false') {
      return res.status(400).json({ error: 'El parámetro de estado debe ser "true" o "false"' });
    }
    const completed = req.params.status === 'true';
    const tasks = await tasksService.getByCompleted(completed);
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// POST: Agregar una nueva tarea
router.post('/', async (req, res) => {
  try {
    const newTask = await tasksService.create(req.body.task, req.body.user);
    res.status(201).json(newTask);
  } catch (err) {
    if (err.message === 'La tarea o el usuario no pueden estar vacíos') {
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error al insertar:', err);
      res.status(500).json({ error: 'Error al agregar tarea' });
    }
  }
});

// PUT: Actualizar una tarea
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await tasksService.update(id, req.body);
    res.json(updatedTask);
  } catch (err) {
    if (err.message === 'Task not found') {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes('proporcionar')) {  // Ajusta según tu mensaje
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error al actualizar:', err);
      res.status(500).json({ error: 'Error al actualizar tarea' });
    }
  }
});

// DELETE: Eliminar una tarea
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tasksService.deleteById(id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Task not found') {
      res.status(404).json({ error: err.message });
    } else {
      console.error('Error al eliminar:', err);
      res.status(500).json({ error: 'Error al eliminar tarea' });
    }
  }
});

export default router;  // Exporta el router por defecto