import Model from '../models/classroom.model.js';

export const getAll = async () => {
  const rows = await Model.getAll();
  if (rows.length === 0) {
    throw new Error('No hay aulas disponibles');
  }
  return rows;
};

export const getById = async (id) => {
  id = Number(id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El ID debe ser un número entero positivo');
  }
  const rows = await Model.getById(id);
  if (rows[0].length === 0) {
    throw new Error('Aula no encontrada');
  }
  return rows[0][0];
};

export const getAvailable = async (day, hour) => {
  const [h] = hour.split(':').map(x => parseInt(x));
  if (h < 8 || h > 21 || h === 12) {
    throw new Error('La hora debe estar entre 08:00 y 21:30; excluyendo el mediodía (12:00)');
  }
  const rows = await Model.getAvailable(day, hour);
  if (rows[0].length === 0) {
    throw new Error('No hay aulas disponibles');
  }
  return rows[0];
};

export const create = async (classroom) => {
  if (!classroom) {
    throw new Error('El aula no puede estar vacía');
  }
  const { name, building, type } = classroom;
  if (typeof building !== 'string' || building.trim() === '') {
    throw new Error('El edificio debe ser una cadena no vacía');
  }
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('El nombre debe ser una cadena no vacía');
  }
  await Model.create(name, building, type);
  return { message: 'Aula agregada exitosamente' };
};

export const update = async (id, classroom) => {
  if (!classroom) {
    throw new Error('El aula no puede estar vacía');
  }
  id = Number(id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El ID debe ser un número entero positivo');
  }

  const { name, building, type } = classroom;

  if (building !== undefined && (typeof building !== 'string' || building.trim() === '')) {
    throw new Error('El edificio debe ser una cadena no vacía');
  }
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    throw new Error('El nombre debe ser una cadena no vacía');
  }

  const result = await Model.update(id, name, building, type);
  if (result.affectedRows === 0) {
    throw new Error('Aula no encontrada');
  }
  return { message: 'Aula actualizada exitosamente' };
};

export const deleteById = async (id) => {
  id = Number(id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El ID debe ser un número entero positivo');
  }
  const result = await Model.deleteById(id);
  if (result.affectedRows === 0) {
    throw new Error('Aula no encontrada');
  }
  return { message: 'Aula eliminada exitosamente' };
};
