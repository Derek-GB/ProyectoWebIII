import * as teacherService from '../services/teacher.service.js';

export const getAll = async (req, res) => {
  try {
    const teachers = await teacherService.getAll();
    res.json(teachers);
  } catch (err) {
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

export const getById = async (req, res) => {
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
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

export const create = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Se requiere un body para registrar un profesor' });
  }

  const { nombre, correo, especialidad } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre es obligatorio' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    console.error('Error al insertar:', err);
    res.status(500).json({ error: 'Error al agregar profesor' });
  }
};

export const update = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'ID del profesor es requerido' });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Se requieren datos para actualizar' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (req.body.correo && !emailRegex.test(req.body.correo)) {
    return res.status(400).json({ error: 'Correo inválido' });
  }

  try {
    const { id } = req.params;
    const updatedTeacher = await teacherService.update(id, req.body);
    res.json(updatedTeacher);
  } catch (err) {
    console.error('Error al actualizar:', err);

    if (err.message === 'Profesor no encontrado') {
      return res.status(404).json({ error: err.message });
    }

    if (err.message.includes('proporcionar') || err.message.includes('vacío')) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Error al actualizar profesor' });
  }
};

export const deleteById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'ID del profesor es requerido' });
  }

  try {
    const { id } = req.params;
    const result = await teacherService.deleteById(id);
    res.json(result);
  } catch (err) {
    console.error('Error al eliminar:', err);

    if (err.message === 'Profesor no encontrado') {
      return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ error: 'Error al eliminar profesor' });
  }
};

export const getScheduleByTeacher = async (req, res) => {
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
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};
