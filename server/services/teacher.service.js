import teacherModel from '../models/teacher.model.js';

export const getAll = async () => {
  return await teacherModel.getAll();
};

export const getById = async (id) => {
  const result = await teacherModel.getById(id);
  if (!result) {
    throw new Error('Profesor no encontrado');
  }
  return result;
};

export const create = async (teacher) => {
  if (!teacher) {
    throw new Error('El profesor no puede estar vacío');
  }
  await teacherModel.create(teacher);
  return { message: 'Profesor agregado exitosamente' };
};

export const update = async (id, teacher) => {
  if (!teacher) {
    throw new Error('El profesor no puede estar vacío');
  }
  const result = await teacherModel.update(id, teacher);
  if (result.affectedRows === 0) {
    throw new Error('Profesor no encontrado');
  }
  return { message: 'Profesor actualizado exitosamente' };
};

export const deleteById = async (id) => {
  const result = await teacherModel.delete(id);
  if (result.affectedRows === 0) {
    throw new Error('Profesor no encontrado');
  }
  return { message: 'Profesor eliminado exitosamente' };
};

export const getScheduleByTeacher = async (nombre) => {
  return await teacherModel.getScheduleByTeacher(nombre);
};