import * as scheduleService from '../services/schedule.service.js';

export const getAll = async (req, res) => {
  try {
    const schedules = await scheduleService.getAll();
    if (!schedules || (Array.isArray(schedules) && schedules.length === 0)) {
      return res.status(404).json({ message: 'No hay horarios registrados' });
    }
    res.json(schedules);
  } catch (err) {
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

export const getById = async (req, res) => {
  try {
    const schedule = await scheduleService.getById(req.params.id);
    res.status(200).json(schedule);
  } catch (err) {
    if (err && err.message === 'Horario no encontrado') {
      return res.status(404).json({ error: err.message });
    }
    if (err && err.message && (err.message.toLowerCase().includes('inválido') || err.message.includes('Debe ser'))) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

export const create = async (req, res) => {
  try {
    const newSchedule = await scheduleService.create(req.body);
    res.status(201).json(newSchedule);
  } catch (err) {
    if (err.message === 'El horario no puede estar vacío' || err.message.includes('inválido') || err.message.includes('Formato') || err.message.includes('Debe ser') ||err.message.includes('no válido')) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Error al insertar:', err);
    res.status(500).json({ error: 'Error al agregar horario' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSchedule = await scheduleService.update(id, req.body);
    res.json(updatedSchedule);
  } catch (err) {
    if (err.message === 'Horario no encontrado') {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('inválido') || err.message.includes('Formato') || err.message.includes('Debe ser') || err.message.includes('no válido') || err.message.includes('proporcionar')) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Error al actualizar:', err);
    res.status(500).json({ error: 'Error al actualizar horario' });
  }
};

export const deleteById = async (req, res) => {
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
};

export const getScheduleByTeacherAndDay = async (req, res) => {
  try {
    const { teacher, day, hour } = req.params;
    const schedule = await scheduleService.getScheduleByTeacherAndDay(teacher, day, hour);
    if (!schedule || (Array.isArray(schedule) && schedule.length === 0)) {
      return res.status(404).json({ message: 'No se encontraron horarios para ese profesor en el día y hora indicados' });
    }
    res.status(200).json(schedule);
  } catch (err) {
    if (err && err.message && (err.message.includes('inválido') || err.message.includes('Formato') || err.message.includes('Debe ser'))) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

export const getScheduleByCourseAndDay = async (req, res) => {
  try {
    const { course, day, hour } = req.params;
    const schedule = await scheduleService.getScheduleByCourseAndDay(course, day, hour);
    if (!schedule || (Array.isArray(schedule) && schedule.length === 0)) {
      return res.status(404).json({ message: 'No se encontraron horarios para ese curso en el día y hora indicados' });
    }
    res.status(200).json(schedule);
  } catch (err) {
    if (err && err.message && (err.message.includes('inválido') || err.message.includes('Formato') || err.message.includes('Debe ser'))) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

export const getClassByCourseAndDay = async (req, res) => {
  try {
    const { teacher, numberClass, typeClass } = req.params;
    const schedule = await scheduleService.getClassByCourseAndDay(teacher, numberClass, typeClass);
    if (!schedule || (Array.isArray(schedule) && schedule.length === 0)) {
      return res.status(404).json({ message: 'No se encontraron horarios para ese profesor y aula indicados' });
    }
    res.status(200).json(schedule);
  } catch (err) {
    if (err && err.message && (err.message.includes('inválido') || err.message.includes('Formato') || err.message.includes('Debe ser'))) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

export const getTeacherByClassAndDay = async (req, res) => {
  try {
    const { numberClass, typeClass, day, hour } = req.params;
    const schedule = await scheduleService.getTeacherByClassAndDay(numberClass, typeClass, day, hour);
    if (!schedule || (Array.isArray(schedule) && schedule.length === 0)) {
      return res.status(404).json({ message: 'No se encontró un profesor asignado a esa aula en la hora indicada' });
    }
    res.status(200).json(schedule);
  } catch (err) {
    if (err && err.message && (err.message.includes('inválido') || err.message.includes('Formato') || err.message.includes('Debe ser'))) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Error en consulta:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

export const deleteAll = async (req, res) => {
  try {
    const { verification } = req.params;
    const result = await scheduleService.deleteAll(verification);
    if (result && result.message && result.message.startsWith('No se borrará')) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    if (err.message === 'No se eliminaron registros') {
      res.status(404).json({ error: err.message });
    } else {
      console.error('Error al eliminar:', err);
      res.status(500).json({ error: 'Error al eliminar horario' });
    }
  }
};
