import express from 'express';
import * as usersService from '../services/users.Service.js';

const router = express.Router();

router.get('/all/', async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.json(users);
  } catch (err) {
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const schedule = await usersService.getById(req.params.id);
    res.status(200).json(schedule);
  } catch (err) {
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newUser = await usersService.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    if (err.message === 'El usuario no puede estar vacío') {
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error al insertar:', err);
      res.status(500).json({ error: 'Error al agregar usuario' });
    }
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await usersService.update(id, req.body);
    res.json(updatedUser);
  } catch (err) {
    if (err.message === 'User not found') {
      res.status(404).json({ error: err.message });
    } else if (err.message.includes('proporcionar')) {  
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error al actualizar:', err);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersService.deleteById(id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User not found') {
      res.status(404).json({ error: err.message });
    } else {
      console.error('Error al eliminar:', err);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
});

export default router; 
